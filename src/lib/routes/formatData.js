// Formats the data in JSON format
export const formatRouteDataJSON = (data) => {
  const groupedData = {};
  data.forEach(({ lot, bloc, dia, tempsRuta, distanciaRuta, municipis }) => {
    if (!groupedData[lot]) groupedData[lot] = {};
    if (!groupedData[lot][bloc]) groupedData[lot][bloc] = {};
    if (!groupedData[lot][bloc][dia]) groupedData[lot][bloc][dia] = [];
    const detailedMunicipis = municipis.map(({ id, info, geo: { latitude, longitude }, pobTotalNum, estanciaMin }) => ({
      id,
      info,
      geo: { latitude, longitude },
      distanciaRuta,
      pobTotalNum,
      estanciaMin
    }));
    groupedData[lot][bloc][dia].push({ tempsRuta, distanciaRuta, municipis: detailedMunicipis });
  });

  return groupedData;
};

// Formats the data in a more readable way suitable for a console output
export const formatRouteDataNice = (data) => {
  const output = [];
  output.push(`\n--------------------------\nOrganització de les rutes:\n     Caixa Enginyers\n--------------------------`);
  for (const lot in data) {
    output.push(`\nRuta per al Lot ${lot}`); // Add: Show lot name ?
    for (const bloc in data[lot]) {
      output.push(`Setmana ${bloc}`);
      for (const dia in data[lot][bloc]) {
        data[lot][bloc][dia].forEach(({ tempsRuta, distanciaRuta, municipis }) => {
          const ruta = municipis.map(m => m.info).join(' -> ');
          output.push(`Dia ${parseInt(dia) + 1}: (${tempsRuta.toFixed(2)}h, ${distanciaRuta.toFixed(2)}km) | ${ruta}`);
        });
      };
    };
  };

  return output.join('\n');
};
