pyramid_jqm
===========

Overview
--------

:mod:`pyramid_jqm` is a package which provides "starter" scaffolding for
creating a :term:`jQuery Mobile` Pyramid application.

Installation
------------

Install using setuptools, e.g. (within a virtualenv)::

  $ easy_install pyramid_jqm

Generating a Sample Application
-------------------------------

The primary job of :mod:`pyramid_jqm` is to provide a :term:`scaffold` which
allows you to easily generate a :term:`Pyramid` application that has jQuery
Mobile integration.  After :mod:`pyramid_jqm` is installed, generate an
application:

.. code-block:: text

   $ paster create -t pyramid_jqm_starter MyApp

This will create a ``MyApp`` :term:`distribution`, in which will live a
``myapp`` Python :term:`package`.  The distribution represents a
redistributable Pyramid application.  The code which drives the application
lives within the package.

The Generated Application
-------------------------

To run the generated application, use ``paster serve`` against the
``development.ini`` file that lives within the distribution directory

.. code-block:: text

   $ paster serve MyApp/development.ini

A server will be listening on port 6543.  When you visit it, you will see
something like the following image:

.. image:: app.png

The generated application is optimized for mobile devices, but is usable via
a normal web browser too.  It contains a variety of demonstration
applications.  You can use it as a template to change and being building your
own Pyramid/jQuery Mobile application.

More Information
----------------

.. toctree::
   :maxdepth: 1

   glossary.rst

Reporting Bugs / Development Versions
-------------------------------------

Visit http://github.com/Pylons/pyramid_jqm to download development or
tagged versions.

Visit http://github.com/Pylons/pyramid_jqm/issues to report bugs.

Indices and tables
------------------

* :ref:`glossary`
* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
