"""Launch the published Blazor game locally and on the same Wi-Fi."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
from pathlib import Path
import socket
import threading
import webbrowser

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--directory',default=str(Path(__file__).resolve().parent/'Play'))
parser.add_argument('--port',type=int,default=8767)
parser.add_argument('--no-browser',action='store_true')
parser.add_argument('--info',help='Optional file for local launch diagnostics')
args=parser.parse_args()
root=Path(args.directory).resolve()
if not (root/'index.html').is_file():
    raise SystemExit('Play/index.html was not found. Extract the complete submission ZIP first.')

class GameHandler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.wasm':'application/wasm','.dll':'application/octet-stream','.dat':'application/octet-stream'}
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()

server=None
for port in range(args.port,args.port+20):
    try:
        server=ThreadingHTTPServer(('0.0.0.0',port),partial(GameHandler,directory=str(root)))
        break
    except OSError:
        continue
if server is None:
    raise SystemExit('No free local port. Close a previous game server and try again.')
url=f'http://127.0.0.1:{server.server_port}/'
print('SNOW & LEAD - C# / Blazor WebAssembly',flush=True)
print('Computer: '+url,flush=True)
try:
    for address in sorted(set(socket.gethostbyname_ex(socket.gethostname())[2])):
        if not address.startswith(('127.','169.254.')):
            print(f'Phone on the same Wi-Fi: http://{address}:{server.server_port}/',flush=True)
except OSError:
    pass
print('Keep this window open. Ctrl+C stops the game server.',flush=True)
if args.info:
    Path(args.info).write_text(json.dumps({'url':url,'port':server.server_port,'directory':str(root)}),encoding='utf-8')
if not args.no_browser:
    threading.Timer(.5,lambda:webbrowser.open_new(url)).start()
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
