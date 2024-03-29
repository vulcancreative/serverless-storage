# Changelog

## [Unreleased](https://github.com/vulcancreative/serverless-storage/tree/HEAD)

[Full Changelog](https://github.com/vulcancreative/serverless-storage/compare/v1.1.4...HEAD)

**Implemented enhancements:**

- Allow `getData` queries to take a dictionary of options [\#40](https://github.com/vulcancreative/serverless-storage/issues/40)
- Implement `query` pagination [\#38](https://github.com/vulcancreative/serverless-storage/issues/38)
- Implement `--tableName` flag to allow for custom table names via the CLI [\#34](https://github.com/vulcancreative/serverless-storage/issues/34)
- Add branding to `README` file [\#27](https://github.com/vulcancreative/serverless-storage/issues/27)
- Resolve wildcard postfix search where no other matching characters are present [\#21](https://github.com/vulcancreative/serverless-storage/issues/21)
- Switch to Scan mechanism for batched requests [\#19](https://github.com/vulcancreative/serverless-storage/issues/19)
- Patch options usage with proper type definition for Framework v3 [\#17](https://github.com/vulcancreative/serverless-storage/issues/17)
- Write README [\#6](https://github.com/vulcancreative/serverless-storage/issues/6)

**Closed issues:**

- Include sponsors in `README` [\#36](https://github.com/vulcancreative/serverless-storage/issues/36)
- Implement unit test [\#29](https://github.com/vulcancreative/serverless-storage/issues/29)
- Add brief information to `README` [\#25](https://github.com/vulcancreative/serverless-storage/issues/25)

**Merged pull requests:**

- Allow `getData` queries to take a dictionary of options. Closes \#40 [\#41](https://github.com/vulcancreative/serverless-storage/pull/41) ([chris-calo](https://github.com/chris-calo))
- Implement `query` pagination. Closes \#38 [\#39](https://github.com/vulcancreative/serverless-storage/pull/39) ([chris-calo](https://github.com/chris-calo))
- Include sponsors in `README`. Closes \#36 [\#37](https://github.com/vulcancreative/serverless-storage/pull/37) ([chris-calo](https://github.com/chris-calo))
- Implement `--tableName` flag to allow for custom table names via the CLI. Closes \#34 [\#35](https://github.com/vulcancreative/serverless-storage/pull/35) ([chris-calo](https://github.com/chris-calo))
- Put test in yarn script. Closes \#29 [\#31](https://github.com/vulcancreative/serverless-storage/pull/31) ([ffebriansyah](https://github.com/ffebriansyah))
- Start adding unit tests. Progress \#29 [\#30](https://github.com/vulcancreative/serverless-storage/pull/30) ([ffebriansyah](https://github.com/ffebriansyah))
- Add branding to `README` file [\#28](https://github.com/vulcancreative/serverless-storage/pull/28) ([chris-calo](https://github.com/chris-calo))
- Add information of the library usage and example project. Closes \#25 [\#26](https://github.com/vulcancreative/serverless-storage/pull/26) ([ffebriansyah](https://github.com/ffebriansyah))
- Resolve wildcard postfix search where no other matching characters are present. Closes \#21 [\#22](https://github.com/vulcancreative/serverless-storage/pull/22) ([chris-calo](https://github.com/chris-calo))
- Switch to Scan mechanism for batched requests. Closes \#19 [\#20](https://github.com/vulcancreative/serverless-storage/pull/20) ([chris-calo](https://github.com/chris-calo))
- Patch options usage with proper type definition for Framework v3. Closes \#17 [\#18](https://github.com/vulcancreative/serverless-storage/pull/18) ([chris-calo](https://github.com/chris-calo))

## [v1.1.4](https://github.com/vulcancreative/serverless-storage/tree/v1.1.4) (2021-08-05)

[Full Changelog](https://github.com/vulcancreative/serverless-storage/compare/v1.1.3...v1.1.4)

**Implemented enhancements:**

- Defer environment variable propagation [\#15](https://github.com/vulcancreative/serverless-storage/issues/15)
- Ensure that running `sls remove` deletes the DynamoDB table [\#8](https://github.com/vulcancreative/serverless-storage/issues/8)

**Merged pull requests:**

- Ensure that running sls remove deletes the DynamoDB table. Closes \#8 [\#16](https://github.com/vulcancreative/serverless-storage/pull/16) ([chris-calo](https://github.com/chris-calo))

## [v1.1.3](https://github.com/vulcancreative/serverless-storage/tree/v1.1.3) (2021-05-29)

[Full Changelog](https://github.com/vulcancreative/serverless-storage/compare/628c28146222aa07cc32a9a6179bf13686942656...v1.1.3)

**Implemented enhancements:**

- Implement key-checking via `hasItem` routine [\#13](https://github.com/vulcancreative/serverless-storage/issues/13)
- Improve region flexibility [\#11](https://github.com/vulcancreative/serverless-storage/issues/11)
- Setup automatic CHANGELOG [\#5](https://github.com/vulcancreative/serverless-storage/issues/5)
- Ensure if a table doesn't exist on-write, one is created first [\#2](https://github.com/vulcancreative/serverless-storage/issues/2)
- Enable prepare script for NPM building pre-publish [\#1](https://github.com/vulcancreative/serverless-storage/issues/1)

**Merged pull requests:**

- Implement key-checking via routine; bug fix. Closes \#13 and \#15 [\#14](https://github.com/vulcancreative/serverless-storage/pull/14) ([chris-calo](https://github.com/chris-calo))
- Improve region flexibility. Closes \#11 [\#12](https://github.com/vulcancreative/serverless-storage/pull/12) ([chris-calo](https://github.com/chris-calo))
- Ensure if a table doesn't exist on-write, one is created first. Closes \#2 [\#10](https://github.com/vulcancreative/serverless-storage/pull/10) ([chris-calo](https://github.com/chris-calo))
- Setup automatic CHANGELOG. Closes \#5 [\#7](https://github.com/vulcancreative/serverless-storage/pull/7) ([chris-calo](https://github.com/chris-calo))
- Enable prepare script for NPM building pre-publish. Closes \#1 [\#4](https://github.com/vulcancreative/serverless-storage/pull/4) ([chris-calo](https://github.com/chris-calo))



\* *This Changelog was automatically generated by [github_changelog_generator](https://github.com/github-changelog-generator/github-changelog-generator)*
