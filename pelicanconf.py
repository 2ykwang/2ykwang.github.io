AUTHOR = 'Youngkwang Yang'
SITENAME = 'Youngkwang'
SITEURL = ""

PATH = "content"

TIMEZONE = 'Asia/Seoul'

DEFAULT_LANG = 'ko'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (
    ("Pelican", "https://getpelican.com/"),
    ("Python.org", "https://www.python.org/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
    ("You can modify those links in your config file", "#"),
)

# Social widget
SOCIAL = (
    ("You can add links in your config file", "#"),
    ("Another social link", "#"),
)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

THEME = "themes/minimal"

# Markdown 설정
MARKDOWN = {
    'extensions': [
        'markdown.extensions.codehilite',
        'markdown.extensions.fenced_code',
        'markdown.extensions.tables',
        'markdown.extensions.toc',
        'markdown.extensions.footnotes',
        'markdown.extensions.def_list',
        'markdown.extensions.abbr',
        'markdown.extensions.attr_list',
        'markdown.extensions.md_in_html',
        'markdown.extensions.extra',
    ],
    'extension_configs': {
        'markdown.extensions.codehilite': {
            'css_class': 'highlight',
            'use_pygments': True,
            'noclasses': False,
            'linenums': False,
        },
    },
    'output_format': 'html5',
}