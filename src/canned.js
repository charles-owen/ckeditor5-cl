
import CannedUI from './cannedui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * A canned responses feature.
 * @constructor
 */
export default class Canned extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ CannedUI ];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Canned';
	}
}

/**
 * The configuration of canned menu options for editing.
 *
 *		ClassicEditor
 *			.create( {
 * 				canned: ... // Canned feature config.
 *			} )
 *			.then( ... )
 *			.catch( ... );
 */

/**
 * The available canned options.
 *
 * The default value is:
 *
 *		const cannedConfig = {
 *			options: []
 *		};
 *
 */
