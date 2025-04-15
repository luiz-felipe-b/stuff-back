/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  watch: false,
  preset: "ts-jest",
  transformIgnorePatterns: ['node_modules/(?!(nanoid)/)'],
  transform: {}
};
