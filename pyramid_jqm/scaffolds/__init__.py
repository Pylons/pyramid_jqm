# package

try: # pragma: no cover (pyramid 1.0.X)
    # "pyramid.paster_templates" doesn't exist past 1.0.X
    from pyramid.paster_templates import PyramidTemplate
    from pyramid.paster_templates import paste_script_template_renderer
except ImportError: # pragma: no cover
    try: # pragma: no cover (pyramid 1.1.X, 1.2.X)
        # trying to import "paste_script_template_renderer" fails on 1.3.X
        from pyramid.scaffolds import paste_script_template_renderer
        from pyramid.scaffolds import PyramidTemplate
    except ImportError: # pragma: no cover (pyramid >=1.3a2)
        paste_script_template_renderer = None
        from pyramid.scaffolds import PyramidTemplate

class JQMStarterProjectTemplate(PyramidTemplate):
    _template_dir = 'jqm_starter'
    summary = 'pyramid jQuery Mobile starter project'
    template_renderer = staticmethod(paste_script_template_renderer)

