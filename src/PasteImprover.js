/**
 * @module PasteImprover
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Clipboard from '@ckeditor/ckeditor5-clipboard/src/clipboard';
import GoogleDocsNormalizer from "@ckeditor/ckeditor5-paste-from-office/src/normalizers/googledocsnormalizer";
import HtmlNormalizer from './normalizers/HtmlNormalizer';
import {RtfToHtml} from '@charles-owen/rtftohtml';

// import CKEditorInspector from '@ckeditor/ckeditor5-inspector';

export default class PasteImprover extends Plugin {

    /**
     * @inheritDoc
     */
    static get pluginName() {
        return 'PasteImprover';
    }

    /**
     * @inheritDoc
     */
    static get requires() {
        return [ Clipboard ];
    }

    /**
     * @inheritDoc
     */
    init() {
       // CKEditorInspector.attach( this.editor );

        const editor = this.editor;
        const model = editor.model;

        const normalizers = [];

        normalizers.push( new HtmlNormalizer() );
        normalizers.push( new GoogleDocsNormalizer() );

        editor.plugins.get( 'Clipboard' ).on(
            'inputTransformation',
            ( evt, data ) => {
                if ( data.isTransformedWithPasteFromOffice ) {

                    return;
                }

                if(data.dataTransfer.types.includes('text/html')) {
                    const htmlString = data.dataTransfer.getData( 'text/html' );
                    const activeNormalizer = normalizers.find( normalizer => normalizer.isActive( htmlString ) );

                    if ( activeNormalizer ) {
                        activeNormalizer.execute( data );

                        data.isTransformedWithPasteFromOffice = true;
                    }

                } else if(data.dataTransfer.types.includes('text/rtf')) {
                    const converter = new RtfToHtml();
                    let html = converter.convert(data.dataTransfer.getData( 'text/rtf' ));

                    // Remove Visual Studio error header
                    html = html.replace('Severity Code Description Project File Line Suppression State Error ', '');

                    data.isTransformedWithPasteFromOffice = true;
                    const normalizer = new HtmlNormalizer();
                    normalizer.executeOnString(data, html);
                }

            },
            { priority: 'high' }
        );

    }
}