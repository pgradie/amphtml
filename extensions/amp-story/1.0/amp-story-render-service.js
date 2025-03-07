import {CommonSignals_Enum} from '#core/constants/common-signals';
import {whenUpgradedToCustomElement} from '#core/dom/amp-element-helpers';

import {Services} from '#service';

/**
 * Maximum milliseconds to wait for service to load.
 * Needs to be shorter than the render delay timeout to account for the latency
 * downloading and executing the amp-story js.
 * @const
 */
const LOAD_TIMEOUT = 2900;

/** @implements {../../../src/render-delaying-services.RenderDelayingService} */
export class AmpStoryRenderService {
  /**
   * @param {!../../../src/service/ampdoc-impl.AmpDoc} ampdoc
   */
  constructor(ampdoc) {
    /**
     * @private {!../../../src/service/ampdoc-impl.AmpDoc}
     */
    this.ampdoc_ = ampdoc;

    /** @const @private {!../../../src/service/timer-impl.Timer} */
    this.timer_ = Services.timerFor(ampdoc.win);
  }

  /**
   * Function to return a promise for when it is finished delaying render, and
   * is ready.  Implemented from RenderDelayingService
   * @return {!Promise}
   */
  whenReady() {
    const whenReadyPromise = this.ampdoc_.whenReady().then((body) => {
      const storyEl = body.querySelector('amp-story[standalone]');

      if (!storyEl) {
        return;
      }

      return whenUpgradedToCustomElement(storyEl).then(() => {
        return storyEl.signals().whenSignal(CommonSignals_Enum.LOAD_END);
      });
    });

    return Promise.race([whenReadyPromise, this.timer_.promise(LOAD_TIMEOUT)]);
  }
}
