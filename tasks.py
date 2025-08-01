import os
import shlex
import shutil
import datetime
import webbrowser

from invoke import task
from invoke.main import program
from pelican import main as pelican_main
from pelican.server import ComplexHTTPRequestHandler, RootedHTTPServer
from pelican.settings import DEFAULT_CONFIG, get_settings_from_file

SETTINGS_FILE_BASE = "pelicanconf.py"
SETTINGS = {}
SETTINGS.update(DEFAULT_CONFIG)
LOCAL_SETTINGS = get_settings_from_file(SETTINGS_FILE_BASE)
SETTINGS.update(LOCAL_SETTINGS)

CONFIG = {
    "settings_base": SETTINGS_FILE_BASE,
    "settings_publish": "publishconf.py",
    "deploy_path": SETTINGS.get("OUTPUT_PATH", "output"),
    "github_pages_branch": "main",
    "commit_message": f"'Publish site on {datetime.date.today().isoformat()}'",
    "host": "localhost",
    "port": 8000,
}


@task
def clean(c):
    """Remove generated files"""
    if os.path.isdir(CONFIG["deploy_path"]):
        shutil.rmtree(CONFIG["deploy_path"])
        os.makedirs(CONFIG["deploy_path"])


@task
def build(c):
    """Build local version of site"""
    pelican_run("-s {settings_base}".format(**CONFIG))


@task
def rebuild(c):
    """`build` with the delete switch"""
    pelican_run("-d -s {settings_base}".format(**CONFIG))


@task
def regenerate(c):
    """Automatically regenerate site upon file modification"""
    pelican_run("-r -s {settings_base}".format(**CONFIG))


@task
def serve(c):
    """Serve site at http://localhost:8000"""
    class AddressReuseTCPServer(RootedHTTPServer):
        allow_reuse_address = True

    server = AddressReuseTCPServer(
        CONFIG["deploy_path"],
        (CONFIG["host"], CONFIG["port"]),
        ComplexHTTPRequestHandler,
    )

    webbrowser.open("http://{host}:{port}".format(**CONFIG))
    print(f"Serving at {CONFIG['host']}:{CONFIG['port']}")
    server.serve_forever()


@task
def reserve(c):
    """`build`, then `serve`"""
    build(c)
    serve(c)


@task
def preview(c):
    """Build production version of site"""
    pelican_run("-s {settings_publish}".format(**CONFIG))


@task
def livereload(c):
    """Automatically reload browser tab upon file modification"""
    try:
        from livereload import Server
    except ImportError:
        print("livereload not installed. Install with: pip install livereload")
        return

    def cached_build():
        pelican_run("-s {settings_base} -e CACHE_CONTENT=true LOAD_CONTENT_CACHE=true".format(**CONFIG))

    cached_build()
    server = Server()
    theme_path = SETTINGS.get("THEME", "themes/minimal")
    
    # Watch files
    server.watch(CONFIG["settings_base"], cached_build)
    server.watch(f"{theme_path}/templates/**/*.html", cached_build)
    server.watch(f"{SETTINGS.get('PATH', 'content')}/**/*.md", cached_build)
    server.watch(f"{theme_path}/static/**/*.css", cached_build)
    server.watch(f"{theme_path}/static/**/*.js", cached_build)

    webbrowser.open("http://{host}:{port}".format(**CONFIG))
    server.serve(host=CONFIG["host"], port=CONFIG["port"], root=CONFIG["deploy_path"])


@task
def gh_pages(c):
    """Publish to GitHub Pages"""
    preview(c)
    c.run(
        "ghp-import -b {github_pages_branch} "
        "-m {commit_message} "
        "{deploy_path} -p".format(**CONFIG)
    )


def pelican_run(cmd):
    cmd += " " + program.core.remainder  # allows to pass-through args to pelican
    pelican_main(shlex.split(cmd))