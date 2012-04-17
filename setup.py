##############################################################################
#
# Copyright (c) 2011 Agendaless Consulting and Contributors.
# All Rights Reserved.
#
# This software is subject to the provisions of the BSD-like license at
# http://www.repoze.org/LICENSE.txt.  A copy of the license should accompany
# this distribution.  THIS SOFTWARE IS PROVIDED "AS IS" AND ANY AND ALL
# EXPRESS OR IMPLIED WARRANTIES ARE DISCLAIMED, INCLUDING, BUT NOT LIMITED TO,
# THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, AGAINST INFRINGEMENT, AND
# FITNESS FOR A PARTICULAR PURPOSE
#
##############################################################################

import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
try:
    README = open(os.path.join(here, 'README.rst')).read()
    CHANGES = open(os.path.join(here, 'CHANGES.txt')).read()
except IOError:
    README = CHANGES = ''

install_requires = [
    'pyramid>=1.1.3', # requires wsgiref paste.server_runner entry point
    ]
testing_extras = ['nose', 'coverage']
docs_extras = ['Sphinx']

setup(name='pyramid_jqm',
      version='0.3',
      description=('a package which provides "starter" scaffolding for '
                   'creating a jQuery Mobile Pyramid application.'),
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Intended Audience :: Developers",
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP :: WSGI",
        "License :: Repoze Public License",
        ],
      keywords='wsgi pylons jqm jquery mobile web pyramid',
      author="Chris McDonough",
      author_email="pylons-devel@googlegroups.com",
      url="http://docs.pylonsproject.org",
      license="BSD-derived (http://www.repoze.org/LICENSE.txt)",
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=install_requires,
      tests_require=install_requires,
      extras_require = {
          'testing':testing_extras,
          'docs':docs_extras,
          },
      test_suite="pyramid_jqm",
      entry_points="""
      [paste.paster_create_template]
      pyramid_jqm_starter=pyramid_jqm.scaffolds:JQMStarterProjectTemplate
      [pyramid.scaffold]
      pyramid_jqm_starter=pyramid_jqm.scaffolds:JQMStarterProjectTemplate
      """
      ,
      )
