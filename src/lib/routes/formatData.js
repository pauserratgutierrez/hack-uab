// Formats the data in JSON format
export const formatRouteDataJSON = (data) => {
  const groupedData = {};
  data.forEach(({ lot, bloc, dia, tempsRuta, municipis }) => {
    if (!groupedData[lot]) groupedData[lot] = {};
    if (!groupedData[lot][bloc]) groupedData[lot][bloc] = {};
    if (!groupedData[lot][bloc][dia]) groupedData[lot][bloc][dia] = [];
    const detailedMunicipis = municipis.map(({ id, info, geo: { latitude, longitude }, pobTotalNum, estanciaMin }) => ({
      id,
      info,
      geo: { latitude, longitude },
      pobTotalNum,
      estanciaMin
    }));
    groupedData[lot][bloc][dia].push({ tempsRuta, municipis: detailedMunicipis });
  });

  return groupedData;
};

// Formats the data in a more readable way suitable for a console output
export const formatRouteDataNice = (data) => {
  const output = [];

  output.push(`\n--------------------------\nOrganització de les rutes:\n     Caixa Enginyers\n--------------------------\n`);
  for (const lot in data) {
    output.push(`Ruta per al Lot ${lot}`); // Add: Show lot name ?
    for (const bloc in data[lot]) {
      output.push(`Setmana ${bloc}`);
      for (const dia in data[lot][bloc]) {
        data[lot][bloc][dia].forEach(({ tempsRuta, municipis }) => {
          const ruta = municipis.map(m => m.info).join(' -> ');
          output.push(`Dia ${parseInt(dia) + 1}: (${tempsRuta.toFixed(2)}h) | ${ruta}`);
        });
      };
    };
  };
  
  return output.join('\n');
};
