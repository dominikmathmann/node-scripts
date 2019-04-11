const txt = `label_info=Info
label_dummy=Dummy`;

function parse() {
  return txt.split('\n').map(line => {
    let [key, message] = line.split('=');
    let id = key.split('_').slice(-1)[0];

    return { key, message, id };
  });
}

function toJava() {
  parse().forEach(line => {
    console.log(`	@Column(name="${line.id.toUpperCase()}")
  private String ${line.id};
  `);
  });
}

function toJSF() {
  const values = parse();

  values.forEach(line => {
    console.log(`<p:outputLabel value="#{messages.${line.key}}" for="${line.id}"></p:outputLabel>
    <p:inputText value="#{lst.${line.id}}" id="${line.id}"></p:inputText>`);
  });
}

function toJSFTable() {
  console.log('<table><thead><tr>');
  const values = parse();

  values.forEach(line =>
    console.log(`<th><p:outputLabel value="#{messages.${line.key}}" for="${line.id}"></p:outputLabel></th>`)
  );

  console.log('</tr></thead><tbody><tr>');
  values.forEach(line =>
    console.log(`<td><p:inputText value="#{demo.${line.id}}" id="${line.id}"></p:inputText></td>`)
  );
  console.log('</tr></tbody></table>');
}

function toDataTable() {
  const values = parse();

  values.forEach(line => {
    console.log(`<h:column>
    <f:facet name="header"><p:outputLabel value="#{messages.${line.key}}" for="${line.id}"></p:outputLabel></f:facet>
    <p:inputText value="#{lst.${line.id}}" id="${line.id}"></p:inputText>
  </h:column>`);
  });
}

toJava();
toJSF();
toJSFTable();
toDataTable();
