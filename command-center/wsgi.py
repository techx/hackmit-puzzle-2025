"""Entry-point to our application.

This file launches the backend server, which also serves the frontend client in
production.
"""

from typing import cast

from server import create_app

app = create_app()
if __name__ == "__main__":
    port = cast(int, app.config["FLASK_RUN_PORT"])
    debug = cast(bool, app.config["DEBUG"])
    app.run(host="0.0.0.0", port=port, debug=debug)
