# Summary

Partial JS port of ruby gem [vipnet_parser](https://github.com/kengho/vipnet_parser).

# Key differences

* implements only `VipnetParser.id()` and `VipnetParser.network()`
* no sort
* returns IDs in order of its appearances in string
* dropping non-uniq IDs could be disabled by setting flag `onlyUnuq` to `false` (default value: `true`)

# License

vipnet-parser is distributed under the WFTPL.
