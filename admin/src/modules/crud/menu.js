export default function(serviceDefinitions) {
  let crudServices = []
  for(let service of serviceDefinitions) {
    let crudModels = []
    for(let modelName in service.models) {
      const model = service.models[modelName]
      if(model.crud) {
        crudModels.push(model)
      }
    }
    if(crudModels.length > 0) {
      crudServices.push({
        name: service.name,
        models: crudModels
      })
    }
  }

  return [{
    title: "Crud",
   // route: { name: "crud:services" },
    submenu: crudServices.flatMap( service =>
      service.models.map( model => {
        return {
          title: service.name + ' / '+model.name,
          icon: 'database',
          route: { name: "crud:model", params: { service: service.name, model: model.name }}
        }
      })
    )
  }]

/*  return [
    {
      title: "Crud",
      route: { name: "crud:services" },
      submenu: crudServices.map( service => ({
        title: service.name,
        route: { name: "crud:service", params: { serviceName: service.name } },
        service,
        submenu: [
          ...(service.models.map( model => {
            return {
              title: service.name + ' / '+model.name,
              icon: 'database',
              route: { name: "crud:model", params: { serviceName: service.name, modelName: model.name }}
            }
          }))
        ]
      }))
    }
  ]*/

}