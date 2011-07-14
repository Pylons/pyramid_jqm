# package
import os

from paste.script.templates import Template
from paste.util.template import paste_script_template_renderer

class PyramidTemplate(Template):
    def pre(self, command, output_dir, vars):
        vars['random_string'] = os.urandom(20).encode('hex')
        package_logger = vars['package']
        if package_logger == 'root':
            # Rename the app logger in the rare case a project is named 'root'
            package_logger = 'app'
        vars['package_logger'] = package_logger
        return Template.pre(self, command, output_dir, vars)

    def post(self, command, output_dir, vars):
        self.out('Welcome to Pyramid.  Sorry for the convenience.')
        return Template.post(self, command, output_dir, vars)

    def out(self, msg): # pragma: no cover (replaceable testing hook)
        print msg

class JQMStarterProjectTemplate(PyramidTemplate):
    _template_dir = 'jqm_starter'
    summary = 'pyramid jQuery Mobile starter project'
    template_renderer = staticmethod(paste_script_template_renderer)

