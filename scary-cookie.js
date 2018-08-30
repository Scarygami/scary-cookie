/*
Copyright 2016-2018 Gerwin Sturm

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
import {microTask} from '@polymer/polymer/lib/utils/async.js';

const EXPIRE_NOW = 'Thu, 01 Jan 1970 00:00:00 GMT';
const FOREVER = 'Fri, 31 Dec 9999 23:59:59 GMT';
const cookieProps = ['expires', 'secure', 'max-age', 'domain', 'path'];

/*
The `scary-cookie` element can be used to set and read cookies.

You should have one `scary-cookie` element per cookie you want to use,
defined by its `name` property.
You can then read the `value` of the cookie, or save the cookie by setting
the `value` attribute or explicitely calling the `save` method.

##### Example

    <scary-cookie name="mycookie"></scary-cookie>

@element scary-cookie
@blurb Element to set and read cookie values
@demo demo/index.html
*/

class ScaryCookie extends PolymerElement {
  static get is() {
    return 'scary-cookie';
  }

  static get properties() {
    return {
      /**
       * Name of the cookie
       *
       * @attribute name
       * @type string
       */
      name: String,

      /**
       * Value of the cookie
       *
       * @attribute value
       * @type string
       */
      value: {
        type: String,
        notify: true
      },

      /**
       * Expiry-date of the cookie as UTC/GMT-formatted String.
       *
       * Example: `"Sun, 15 Jul 2012 00:00:01 GMT"`
       *
       * @attribute expires
       * @type string
       * @default never
       */
      expires: {
        type: String,
        value: FOREVER
      },

      /**
       * If true, cookie will only be transmitted over secure protocol as https
       *
       * @attribute secure
       * @type boolean
       * @default false
       */
      secure: {
        type: Boolean,
        value: false
      },

      /**
       * The domain from where the cookie will be readable.
       * E.g., "example.com", ".example.com" (includes all subdomains)
       * or "subdomain.example.com"; if not specified, defaults to the
       * host portion of the current document location
       *
       * @attribute domain
       * @type string
       */
      domain: {
        type: String
      },

      /**
       * The path from where the cookie will be readable.
       * E.g., "/", "/mydir"; if not specified, defaults to the current
       * path of the current document location.
       *
       * @attribute path
       * @type string
       */
      path: {
        type: String
      },

      /**
       * The maximum age of the cookie in seconds.
       *
       * @attribute maxAge
       * @type number
       */
      maxAge: {
        type: Number
      },

      /**
       * If true, the cookie won't be automatically saved when properties are changed
       *
       * @attribute disableAutoSave
       * @type boolean
       */
      disableAutoSave: {
        type: Boolean,
        value: false
      }
    };
  }

  static get observers() {
    return [
      '_cookieChanged(name, value, expires, secure, domain, path, maxAge)'
    ];
  }

  ready() {
    super.ready();
    this._load();
  }

  _load() {
    const cookieValue = this._parseCookie();
    this.value = cookieValue && cookieValue.value;
  }

  _parseCookie() {
    const pairs = document.cookie.split(/\s*;\s*/);
    const cookies = pairs.map(cookieString => {
      const eq = cookieString.indexOf('=');
      return {
        name: unescape(cookieString.slice(0, eq)),
        value: unescape(cookieString.slice(eq + 1))
      };
    });
    return cookies.filter(cookie => (cookie.name === this.name))[0];
  }

  /**
   * Returns true if the cookie is currently set.
   *
   * @return {Boolean}
   */
  get isCookieStored() {
    return Boolean(this._parseCookie());
  }

  /**
   * Deletes the cookie.
   *
   * @method deleteCookie
   */
  deleteCookie() {
    this.expires = EXPIRE_NOW;
    this.value = undefined;
    if (this.disableAutoSave) {
      this.save();
    }
  }

  _cookieChanged() {
    if (this.disableAutoSave) {
      return;
    }
    this._saveJob = Debouncer.debounce(this._saveJob, microTask, () => this.save());
  }

  /**
   * Sets the cookie with the currently defined parameters.
   *
   * @method save
   */
  save() {
    if (this.name && (this.value || this.expires === EXPIRE_NOW)) {
      document.cookie = escape(this.name) + '=' + escape(this.value) + this._prepareProperties();
    }
  }

  _prepareProperties() {
    let prepared = '';
    for (let i = 0; i < cookieProps.length; i++) {
      const prop = cookieProps[i];
      if (this[prop]) {
        prepared += (';' + prop + '=' + this[prop]);
      }
    }
    return prepared;
  }
}

window.customElements.define(ScaryCookie.is, ScaryCookie);
