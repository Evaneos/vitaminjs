const { configure } = require('enzyme');
const Adapter = require('enzyme-adapter-react-15');

// config
configure({ adapter: new Adapter() });
