(function($) {
  $(function() {

    // TODO localization
    const PRIORITIES = [ 'should', 'must' ];

    // #####################
    // configuration section
    // #####################
    let serverEndpoint = 'http://141.26.209.52:8001';
    let serverPath = 'REST'

    // ################
    // function section
    // ################

    /**
     * Removes the rule whose remove button has been clicked.
     */
    let onBtnRemoveRuleClick = function() {
      let $rule = $( this ).parents( '.rule' );
      $rule.remove();
    };

    /**
     * Creates a HTML element that can hold and manipulate a rule.
     * @param {string} name current rule name (only if loading a rule from the server)
     * @param {int} priority current priority value (only if loading a rule from the server)
     */
    let createRuleElement = function( name, priority ) {
      // wrapper element to be returned
      let $container = $( '<div>', {
        class: 'rule',
      } );
      // input: rule name
      let $inpName = $( '<input>', {
        id: `name_${ ++ruleId }`,
        type: 'text',
        class: 'name',
      });
      // adopt current rule name, if set
      if ( name ) $inpName.val( name );
      $container.append( $inpName );
      // input: rule priority
      let $inpPriority = $( '<select>', {
        id: `priority_${ ruleId }`,
        class: 'priority',
      });
      $container.append( $inpPriority );
      // insert priority options
      for( let iOpt in PRIORITIES ) {
        $inpPriority.append(
          $( '<option>', {
            value: iOpt,
          }).text( PRIORITIES[iOpt] )
        );
      };
      // adopt current rule priority, if set
      if ( priority !== undefined ) $inpPriority.val( priority );

      // button to remove the rule
      let $btnRemoveRule = $( '<input>', {
        type: 'button',
        class: 'remove',
        value: 'Remove',
      });
      $btnRemoveRule.click( onBtnRemoveRuleClick );
      $container.append( $btnRemoveRule );

      return $container;
    };

    /**
     * Transforms the current policy with its rule list into a JSON object.
     */
    let formToJson = function() {
      let $rules = $ruleList.children( '.rule' );
      let rules = [];
      let schema = {
        rules: rules
      };
      // push one rule object onto the rules array for each rule in the rule list
      $rules.each( function( i, e ) {
        let $rule = $( e );
        rules.push({
          'name': $rule.find( '.name' ).first().val(),
          'priority': $rule.find( '.priority' ).first().val(),
        });
      });
      return schema;
    };

    /**
     * Replaces the current policy UI with elements representing the given policy and its rules.
     * @param {Object} policy policy object
     */
    let renderPolicy = function( policy ) {
      $ruleList.empty();
      for( let iRule in policy.rules ) {
        $ruleList.append( createRuleElement( policy.rules[iRule].name, policy.rules[iRule].priority ) );
      }
      // focus first input of last rule item
      $ruleList.children().last().find( '.name' ).focus();
    };

    /**
     * Loads a policy by its page title using a REST endpoint.
     * @param {string} pageTitle MediaWiki page title to pass to the backend
     */
    let loadPolicy = function( pageTitle ) {
      let url = `${serverEndpoint}/${serverPath}/load`;
      $.getJSON( url, {
        page: pageTitle,
      }).done(function( policy ) {
        renderPolicy( policy );
      }).fail(function() {
        // TODO handle and show errors here, e.g. policy schema violations
      });
      // DEBUG simulate successful policy loading
      renderPolicy({
        rules: [
          {
            name: 'TestPolicy',
            priority: 1,
          },
          {
            name: 'AnotherPolicy',
            priority: 0,
          },
        ],
      });
    };

    /**
     * Saves the policy in its current state by using the appropriate REST endpoint.
     */
    let savePolicy = function() {
      let schema = formToJson();
      // TODO replace with backend call saving the policy
      console.log( JSON.stringify( schema ) );
    };

    /**
     * Adds an empty rule to the rule list.
     */
    let addEmptyRule = function() {
      let $rule = createRuleElement();
      $ruleList.append( $rule );
      $rule.find( '.name' ).focus();
    };

    // ################################################
    // inject the policy management UI into #policyForm
    // ################################################

    // button: add rule
    let $form = $( '#policyForm' );
    let $btnAddRule = $( '<input>', {
      id: 'btnAddRule',
      type: 'button',
      value: 'Add Rule',
    });
    $form.append( $btnAddRule );
    // on click: add empty rule
    $btnAddRule.click( addEmptyRule );

    // rule list
    let $ruleList = $( '<div>', {
      id: 'rules',
    });
    $form.append( $ruleList );

    // button: save policy
    let $btnSavePolicy = $( '<input>', {
      id: 'btnSavePolicy',
      type: 'button',
      value: 'Save Policy',
    });
    $form.append( $btnSavePolicy );
    // on click: save policy to backend
    $btnSavePolicy.click( savePolicy );

    // ################
    // variable section
    // ################
    let ruleId = 0;
    // TODO load title via MediaWiki API
    let pageTitle = 'Policy:SourceCredibility';

    // ###############
    // startup section
    // ###############
    
    // load the policy that this page represents into the UI
    loadPolicy( pageTitle );

  });
})(jQuery);
