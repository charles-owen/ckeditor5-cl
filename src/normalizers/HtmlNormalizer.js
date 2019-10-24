/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module paste-from-office/normalizers/mswordnormalizer
 */

import { parseHtml } from '../filters/parse';
import { transformListItemLikeElementsIntoLists } from '../filters/list';
import { replaceImagesSourceWithBase64 } from '../filters/image';

const msWordMatch1 = /<meta\s*name="?generator"?\s*content="?microsoft\s*word\s*\d+"?\/?>/i;
const msWordMatch2 = /xmlns:o="urn:schemas-microsoft-com/i;

/**
 * Normalizer for the content pasted from Microsoft Word.
 *
 * @implements module:paste-from-office/normalizer~Normalizer
 */
export default class HtmlNormalizer {
    /**
     * @inheritDoc
     */
    isActive( htmlString ) {
        return msWordMatch1.test( htmlString ) || msWordMatch2.test( htmlString );
    }

    /**
     * @inheritDoc
     */
    execute( data ) {
        const html = data.dataTransfer.getData( 'text/html' );
        this.executeOnString(data, html);
    }

    executeOnString(data, html) {
        const { body, stylesString } = parseHtml( html );

        transformListItemLikeElementsIntoLists( body, stylesString );
        replaceImagesSourceWithBase64( body, data.dataTransfer.getData( 'text/rtf' ) );

        data.content = body;
    }
}
