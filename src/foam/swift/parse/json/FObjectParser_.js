/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

foam.CLASS({
  package: 'foam.swift.parse.json',
  name: 'FObjectParser_',
  extends: 'foam.swift.parse.parser.ProxyParser',
  requires: [
    'foam.swift.parse.json.KeyParser',
    'foam.swift.parse.json.StringParser',
    'foam.swift.parse.json.Whitespace',
    'foam.swift.parse.parser.Literal',
    'foam.swift.parse.parser.Optional',
    'foam.swift.parse.parser.Seq1',
  ],
  properties: [
    {
      swiftType: 'ClassInfo?',
      name: 'defaultClass',
    },
    {
      name: 'delegate',
      swiftFactory: function() {/*
return 
  Seq1(["index": 4, "parsers": [
    KeyParser(["key": "class"]),
    Whitespace(),
    Literal(["string": ":"]),
    Whitespace(),
    StringParser(),
    Optional(["delegate": 
      Literal(["string": ","]),
    ])
  ]])
      */},
    },
  ],
  methods: [
    {
      name: 'parse',
      swiftCode: function() {/*
var ps: PStream? = ps
let ps1 = delegate.parse(ps!, x)

guard let c: ClassInfo = ps1 != nil ? x.lookup(ps1!.value() as! String) :
    x.lookup("defaultClass") ?? defaultClass else {
  return nil
}

if ps1 != nil {
 ps = ps1
}

let subx = x.createSubContext(args: [
  "obj": (x["X"] as! Context).create(cls: c)
])
ps = ModelParserFactory.getInstance(c).parse(ps!, subx)

if ps != nil {
  return ps!.setValue(subx["obj"])
}
return nil
      */},
    },
  ],
});
