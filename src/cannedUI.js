/**
 * @module CannedUI
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';

import cannedIcon from '../img/canned.svg';

/**
 * The Canned UI feature. It introduces the `canned` dropdown.
 *
 * @extends module:core/plugin~Plugin
 */
export default class CannedUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );

		editor.config.define( 'canned', {
			options: []
		} );
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const t = editor.t;
		const options = editor.config.get( 'canned.options' );
		const defaultTitle = t( 'Choose canned response' );
		const dropdownTooltip = t( 'Canned' );

		// Register UI component.
		editor.ui.componentFactory.add( 'canned', locale => {
			const titles = {};
			const itemDefinitions = new Collection();

			// Add options to the dropdown
			for ( const option of options ) {
				const def = {
					type: 'button',
					model: new Model( {
						label: option.title,
						text: option.text,
						withText: true
					} )
				};

				// Add the option to the collection.
				itemDefinitions.add( def );

				titles[ option.model ] = option.title;
			}

			const dropdownView = createDropdown( locale );
			addListToDropdown( dropdownView, itemDefinitions );

			dropdownView.buttonView.set( {
				label: 'Canned',
				tooltip: dropdownTooltip,
				icon: cannedIcon
			} );

			// Execute command when an item from the dropdown is selected.
			this.listenTo( dropdownView, 'execute', evt => {
				const viewFragment = editor.data.processor.toView( evt.source.text );
				const modelFragment = editor.data.toModel( viewFragment );

				const insertPosition = editor.model.document.selection;
				editor.model.insertContent( modelFragment, insertPosition );
			} );

			return dropdownView;
		} );
	}
}
