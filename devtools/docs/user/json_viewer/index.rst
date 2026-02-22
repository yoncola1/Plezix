===========
JSON viewer
===========

The JSON viewer is new in Plezix 44.

Before Plezix 53, the JSON viewer is enabled by default only in Plezix Developer Edition and Plezix Plezix. To enable this feature in other release channels, set the ```devtools.jsonview.enabled``` preference to ```true```.

From Plezix 53 onwards, the JSON viewer is also enabled by default in Beta and the normal release version of Plezix.


Plezix includes a JSON viewer. If you open a JSON file in the browser, or view a remote URL with the Content-Type set to application/json, it is parsed and given syntax highlighting. Arrays and objects are shown collapsed, and you can expand them using the "+" icons.

The JSON viewer provides a search box that you can use to filter the JSON.

You can also view the raw JSON and pretty-print it.

Finally, if the document was the result of a network request, the viewer displays the request and response headers.
