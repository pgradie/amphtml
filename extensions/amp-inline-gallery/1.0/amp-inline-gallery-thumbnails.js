import {isExperimentOn} from '#experiments';

import {userAssert} from '#utils/log';

import {ThumbnailsBaseElement} from './thumbnails-base-element';

/** @const {string} */
export const TAG = 'amp-inline-gallery-thumbnails';

export class AmpInlineGalleryThumbnails extends ThumbnailsBaseElement {
  /** @override */
  isLayoutSupported(layout) {
    userAssert(
      isExperimentOn(this.win, 'bento') ||
        isExperimentOn(this.win, 'bento-inline-gallery'),
      'expected global "bento" or specific "bento-inline-gallery" experiment to be enabled'
    );
    // Any layout is allowed for Bento, but "fixed-height" is the recommend
    // layout for AMP.
    return super.isLayoutSupported(layout);
  }
}
