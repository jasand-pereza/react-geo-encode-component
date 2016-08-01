

##Example - using jQuery

```js
(function($){
  'use strict';
  let $elements = $('.geocoding-component-container');
  if(!$elements.length) return;
  // for multiple components on a page
  $elements.each(function(){
    ReactDOM.render(
      <GeocodingComponent
        google_api_key = '{{GOOGLE_API_KEY}}'
        db_value={$(this).val()}
        field_name={$(this).attr('name')} />,
      $(this).parent()[0]
    );
  });
})(jQuery);
```

![Screenshot of component]()

