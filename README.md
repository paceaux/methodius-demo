# Methodius Demo
This is a project that demonstrates the capabilities of the <a href="https://github.com/paceaux/methodius">Methodius library</a>. Methodius is a JavaScript library that allows developers to analyze text.

You can view this demo live at [experiments.frankmtaylor.com/methodius-demo](https://experiments.frankmtaylor.com/methodius).

## Running Locally

_Requires having node.js installed ( >=20)_
To run this demo locally, follow these steps:

1. Clone the repository:

```bash
   git clone https://github.com/paceaux/methodius-demo.git
```

2.Navigate to the project directory:

```bash
    cd methodius-demo
```

3.Install dependencies:

```bash
    npm install
```

4.Run it locally:

```bash
    npm start
```

## Adding a language

Right now it's a manual effort to add a language. That's annoying.

1. Create a `.js` file in `samples/` that uses the ISO-639-1 language code for the language. If one doesn't exist, use ISO-639-2.
2. Have that file export the following things:
   - `name`: The English name of the language.
   - `udhrPreamble`: The preamble of the Universal Declaration of Human Rights in that language.
   - `udhr1`: Article 1 of the Universal Declaration of Human Rights in that language.
   - `lang`: The ISO-639-1 or ISO-639-2 code for that language.
   - `direction`: if the language is not ltr, add this property with the value `rtl`.
3. Import that file in `samples/index.js` and add it to the exported set.
4. Add a new `<table-set>` in `index.html` for that language, using the same structure as the existing ones.
