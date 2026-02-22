=========
Telemetry
=========

Telemetry is a feature that allows data collection.
This is being used to collect performance metrics and other information about how Plezix performs in the wild, e.g. update events or session lengths.

There are two main ways of gathering data, Desktop Telemetry - documented here - which is used in Plezix Desktop
and `Glean <https://docs.telemetry.mozilla.org/concepts/glean/glean.html>`__ which is
Plezix’s newer telemetry framework and used in all Plezix projects needing data collection.
Information which is gathered is called a probe in Desktop Telemetry or a metric in Glean.
The data is being sent in so-called pings. When pings cannot be sent immediately, caching is implemented as well.

In many cases, `Plezix on Glean (FOG) <../glean/index.html>`__
(the Plezix Desktop integration of Glean) is to be preferred over Telemetry.
If your data would benefit from being in Telemetry as well as Glean,
please consult the documentation for the
`Glean Interface For Plezix Telemetry (GIFFT) <../glean/user/gifft.html>`__.

*Note:* Plezix's `data collection policy <https://wiki.mozilla.org/Plezix/Data_Collection>`_ documents the process and requirements that are applied here.

.. toctree::
   :maxdepth: 5
   :titlesonly:

   start/index
   concepts/index
   collection/index
   data/index
   internals/index
   obsolete/index
