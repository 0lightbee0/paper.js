/*
 * Paper.js
 *
 * This file is part of Paper.js, a JavaScript Vector Graphics Library,
 * based on Scriptographer.org and designed to be largely API compatible.
 * http://paperjs.org/
 * http://scriptographer.org/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * Copyright (c) 2011, Juerg Lehni & Jonathan Puckey
 * http://lehni.org/ & http://jonathanpuckey.com/
 *
 * All rights reserved.
 */

var Layer = this.Layer = Group.extend({
	beans: true,

	initialize: function() {
		this.children = [];
		this._document = paper.document;
		this._document.layers.push(this);
		this.activate();
	},

	getIndex: function() {
		return this.parent ? this.base() : this._document.layers.indexOf(this);
	},

	/**
	* Removes the layer from its document's layers list
	* or its parent's children list.
	*/
	_removeFromParent: function() {
		if (!this.parent) {
			return !!this._document.layers.splice(this.getIndex(), 1).length;
		} else {
			return this.base();
		}
	},

	getNextSibling: function() {
		return this.parent ? this.base()
				: this._document.layers[this.getIndex() + 1] || null;
	},

	getPreviousSibling: function() {
		return this.parent ? this.base()
				: this._document.layers[this.getIndex() - 1] || null;
	},

	activate: function() {
		this._document.activeLayer = this;
	}
}, new function () {
	function move(above) {
		return function(item) {
			// if the item is a layer and contained within Document#layers
			if (item instanceof Layer && !item.parent
					&& this._removeFromParent()) {
				item._document.layers.splice(item.getIndex() + (above ? 1 : -1),
						0, this);
				this._setDocument(item._document);
				return true;
			} else {
				return this.base(item);
			}
		};
	}

	return {
		moveAbove: move(true),

		moveBelow: move(false)
	};
});
