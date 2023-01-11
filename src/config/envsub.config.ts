import envsub from 'envsub';
import { join } from 'path';

const YAML_CONFIG_FILENAME = './config.yaml';
const {
  PORT,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_HOST,
  RABBITMQ_QUEUE_NAME,
} = process.env;

const templateFile = join(__dirname, YAML_CONFIG_FILENAME);
const outputFile = join(__dirname, YAML_CONFIG_FILENAME);

const options = {
  all: false,
  diff: false,
  envs: [
    // port
    { name: 'PORT', value: PORT },
    { name: 'RABBITMQ_USER', value: RABBITMQ_USER },
    { name: 'RABBITMQ_PASSWORD', value: RABBITMQ_PASSWORD },
    { name: 'RABBITMQ_HOST', value: RABBITMQ_HOST },
    { name: 'RABBITMQ_QUEUE_NAME', value: RABBITMQ_QUEUE_NAME },
  ],
  envFiles: [join(__dirname, YAML_CONFIG_FILENAME)],
  protect: false,
  syntax: 'default',
  system: true,
};

// create (or overwrite) the output file
export const envObjStart = () =>
  envsub({ templateFile, outputFile, options })
    .then(() => {
      console.log('env-sub has loaded');
    })
    .catch((err: Error) => {
      console.error(err.message);
    });
