import os, sys, http.server, socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
print("Serving from:", os.getcwd(), file=sys.stderr)

PORT = 5173
Handler = http.server.SimpleHTTPRequestHandler

class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True

with ReusableTCPServer(("", PORT), Handler) as httpd:
    print(f"Listening on port {PORT}", file=sys.stderr)
    httpd.serve_forever()
