import envsub from 'envsub';
import { join } from 'path';

const YAML_CONFIG_FILENAME = './config.yaml';
const {
  PORT,
  RABBITMQ_USER,
  RABBITMQ_PASSWORD,
  RABBITMQ_HOST,
  RABBITMQ_QUEUE_NAME,
  MAIL_HOST,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM,
  MAIL_PORT,
} = process.env;

const templateFile = join(__dirname, YAML_CONFIG_FILENAME);
const outputFile = join(__dirname, YAML_CONFIG_FILENAME);

const options = {
  all: false,
  diff: false,
  envs: [
    // port
    { name: 'PORT', value: PORT },
    //rabbitmq config
    { name: 'RABBITMQ_USER', value: RABBITMQ_USER },
    { name: 'RABBITMQ_PASSWORD', value: RABBITMQ_PASSWORD },
    { name: 'RABBITMQ_HOST', value: RABBITMQ_HOST },
    { name: 'RABBITMQ_QUEUE_NAME', value: RABBITMQ_QUEUE_NAME },
    //mailconfig
    { name: 'MAIL_HOST', value: MAIL_HOST },
    { name: 'MAIL_USER', value: MAIL_USER },
    { name: 'MAIL_PASSWORD', value: MAIL_PASSWORD },
    { name: 'MAIL_FROM', value: MAIL_FROM },
    { name: 'MAIL_PORT', value: MAIL_PORT },
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
