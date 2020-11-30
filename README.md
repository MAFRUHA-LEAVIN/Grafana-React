# grafana_tuni_project
A Grafana plugin developed on Software engineering project course . The plugin enables further analysis for data visualized in Grafana by sending requests to an analysis service.

## Installing the plugin
Clone the repository to your Grafana plugins directory. The plugins directory is usually located at grafana_root_dir/data/plugins.

Then go to the root of the repository and follow the steps below.

### Getting started
1. Install dependencies
```BASH
npm install
```
2. Run plugin in watch mode (development mode)
```BASH
npm watch
```
3. Build plugin in production mode
```BASH
npm build
```

## Proxying through a datasource
The request API can proxy requests if a datasource plugin is configured with the wanted target urls. An example of a datasource plugin is simpod JSON datasource that can be found in the link below. Two datasources are needed, one for the options fetching and one for the analysis results fetching.

[example datasource](https://grafana.com/grafana/plugins/simpod-json-datasource)

Additionally the ip and port of the target server needs to be set in a Grafana configuration variable.

##### Configuration variable
data_source_proxy_whitelist
##### Path of the configuration file: 
conf/custom.ini
##### Format of the variable should be: 
ip_or_domain:port
