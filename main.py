from fasthtml.common import *

app, rt = fast_app()

@rt("/")
def get():
  return Titled("My Portfolio" P("Welcome!"))

serve()
