import React from 'react';

export default class GeocodingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      coords: props.db_value,
      address: '',
      static_img_src: (props.db_value) ? this.constructMapImgSrc(props.db_value): ''
    };
  }
  render() {
    const style_address = { width: '100%' };
    const table_style = { border: 'solid thin #CCC' };
    return (
      <div className="geocoding-component">

        <input type="hidden" name={this.props.field_name} value={this.state.coords} />

        <table style={table_style}>
          <tbody>
            <tr>
              <td>
                <img
                  style={(this.state.static_img_src.length) ? { display: 'block' } : { display: 'none' }}
                  src={this.state.static_img_src}
                  />
              </td>

              <td style={{ padding: '20px' }}>
                <label>Enter an address</label><br />
                <input
                  ref="address"
                  onChange={this.setNewAddress.bind(this)}
                  placeholder={this.props.field_address_placeholder}
                  type="text"
                  name="geocoding_component_field_address"
                  style={style_address}
                />
                <p></p>
                <button
                  onClick={this.getCoords.bind(this)}
                  className="button"
                  ref="btn-encoder">{this.props.btn_text}
                </button>

                <p></p>
                <hr />
                <label>Coordinates for map</label><br />
                <input
                  ref="lat_lng"
                  type="text"
                  name="geocoding_component_field_lat_lng"
                  disabled="disabled"
                  value={this.state.coords}
                  placeholder={this.props.field_lat_lng_placeholder}
                  style={style_address}
                />
                <p></p>
                <button
                  className="button"
                  ref="btn-remove-coordinates"
                  onClick={this.removeCoords.bind(this)} >
                  remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  setNewAddress(event) {
    this.state.address = event.target.value;
  }

  getLatLngFromGoogleData(data) {
    if(typeof data.status == 'undefined') return false;
    if(data.status != 'OK') return false;
    if(typeof data.results == 'undefined') return false;
    if(typeof data.results[0] == 'undefined') return false;
    if(typeof data.results[0].geometry == 'undefined') return false;
    if(typeof data.results[0].geometry.location == 'undefined') return false;
    // Google will return a result with Foo Bar if an invalid address is typed
    if(data.results[0].formatted_address.search(/Foo Bar/ig) > -1 ) {
      alert('invalid address');
      return false;
    }
    return [data.results[0].geometry.location.lat, data.results[0].geometry.location.lng].join(', ');
  }

  constructMapImgSrc(lat_lng) {
    let url = this.props.url_static_map;
    url += '?key=' + this.props.google_api_key;
    url += '&location=' + lat_lng;
    url += '&maptype=roadmap';
    url += '&size=260x260';
    url += '&markers=color:red|' + lat_lng;
    url += '&zoom=9';
    return url;
  }

  getCoords(e) {
    var self = this;
    e.preventDefault();
    if(!this.state.address.length) {
      alert('Please enter a valid address');
      return;
    }
    jQuery.ajax({
      url: this.props.url_geocode,
      dataType: 'json',
      type: 'get',
      data: {
        address: this.state.address,
        key: this.props.google_api_key
      }
    }).then((d) => {
      let lat_lng = self.getLatLngFromGoogleData(d);
      if(lat_lng) {
        self.setState({
          coords: lat_lng,
          static_img_src: self.constructMapImgSrc(lat_lng)
        });
      } else {
        alert('The address could not be converted. Please check the address.');
      }
    });
  }

  removeCoords(e) {
    e.preventDefault();
    this.setState({
      coords: '',
      static_img_src: '',
      address: this.state.address
    });
  }
}

GeocodingComponent.defaultProps = {
  field_address_placeholder: 'Enter an address here (You can include zip, state, and country)',
  field_lat_lng_placeholder: 'lat and lng will appear here',
  btn_text: 'Get coordinates from address',
  url_geocode: 'https://maps.googleapis.com/maps/api/geocode/json',
  url_static_map: 'https://maps.googleapis.com/maps/api/staticmap',
};
