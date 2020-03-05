/**
 * @license
 * Copyright 2020 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.comics.v2',
  name: 'BasicEnabledActionsAuth',
  implements: [
    'foam.comics.v2.EnabledActionsAuth'
  ],
  javaImports: [
    'foam.util.SafetyUtil'
  ],

  documentation: `
    String arrays of permissions that will be checked on each CRUD action through availablePermissions
  `,

  properties: [
    {
      class: 'String',
      name: 'modelName',
      factory: function(){
        debugger;
        return "test";
      }
    },
  ],

  methods: [
    {
      name: 'permissionFactory',
      type: 'String',
      args: [
        {
          name: 'operation',
          type: 'foam.nanos.ruler.Operations'
        },
        {
          name: 'obj',
          type: 'FObject'
        }
      ],
      javaCode: `
        String outputString = getModelName();

        if ( SafetyUtil.equals(operation, foam.nanos.ruler.Operations.CREATE ) ){
          outputString += ".create";
        } else if ( SafetyUtil.equals(operation, foam.nanos.ruler.Operations.UPDATE) ) {
          outputString += ".update." + obj.getProperty("id");
        } else if ( SafetyUtil.equals(operation, foam.nanos.ruler.Operations.REMOVE) ) {
          outputString += ".remove." + obj.getProperty("id");
        } else {
          throw new RuntimeException("Submitted an invalid operation");
        }

        return outputString;
      `,
      code: function(operation, obj) {
        let outputString = this.modelName;
        if ( operation === foam.nanos.ruler.Operations.CREATE ) {
          outputString += '.create';
        } else if ( operation === foam.nanos.ruler.Operations.UPDATE ) {
          outputString += '.update.' + obj.id;
        } else if ( operation === foam.nanos.ruler.Operations.REMOVE ) {
          outputString += '.remove.' + obj.id;
        } else {
          throw new Error("Submitted an invalid operation");
        }

        return outputString;
      }
    }
  ]
});