export default function(serviceDefinitions) {
  return [
    {
      title: "Api",
      route: { name: "api:services" },
      submenu: serviceDefinitions.map( service => ({
        title: service.name,
        route: { name: "api:service", params: { serviceName: service.name } },
        service,
        submenu: [
          ...(Object.keys(service.models).map( modelName => {
            let model = service.models[modelName]
            return {
              title: model.name,
              icon: 'database',
              route: { name: "api:model", params: { serviceName: service.name, modelName: model.name }}
            }
          })),
          ...(Object.keys(service.views).map( viewName => {
            let view = service.views[viewName]
            return {
              title: view.name,
              icon: 'eye',
              route: { name: "api:view", params: { serviceName: service.name, viewName: view.name }}
            }
          })),
          ...(Object.keys(service.actions).map( actionName => {
            let action = service.actions[actionName]
            return {
              title: action.name,
              icon: 'cog',
              route: { name: "api:action", params: { serviceName: service.name, actionName: action.name }}
            }
          }))
        ]
      }))
    }
  ]

}