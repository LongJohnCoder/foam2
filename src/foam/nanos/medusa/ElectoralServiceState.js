foam.ENUM({
    package: 'foam.nanos.medusa',
    name: 'ElectoralServiceState',
  
    documentation: `
        Voting state of a node/instance in a cluster.
      `,
  
    values: [
      {
        name: 'ELECTION',
        label: 'Election'
      },
      {
        name: 'VOTING',
        label: 'Voting'
      },
      {
        name: 'IN_SESSION',
        label: 'In session'
      }
    ]
  });
  