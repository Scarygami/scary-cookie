# scary-cookie

[![Build Status](https://travis-ci.org/Scarygami/scary-cookie.svg?branch=master)](https://travis-ci.org/Scarygami/scary-cookie)
[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/Scarygami/scary-cookie)

The `scary-cookie` element can be used to set and read cookies.
You should have one `scary-cookie` element per cookie you want to use,
defined by its `name` property.
You can then read the `value` of the cookie, or save the cookie by setting
the `value` attribute or explicitely calling the `save` method.

##### Example
    <scary-cookie name="mycookie"></scary-cookie>
