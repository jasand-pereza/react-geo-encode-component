##Example

```j
window.FPSB.initGeoComponents = () => {
  var $ = jQuery;
  let $elements = $('.geocoding-component-container');
  if(!$elements.length) return;
  $elements.each(function(){
    ReactDOM.render(
      <GeocodingComponent
        google_api_key = '{{GOOGLE_API_KEY}}'
        db_value={$(this).val()}
        field_name={$(this).attr('name')} />,
      $(this).parent()[0]
    );
  });
};
```
