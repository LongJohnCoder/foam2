/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
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

/**
 * List of all FOAM files available to be loaded in a JSONP
 * format, so it can used from both nodejs scripts, and web
 * pages via script tags easily.
 */

FOAM_FILES([
  { name: "foam/core/lib" },
  { name: "foam/core/stdlib" },
  { name: "foam/core/events" },
  { name: "foam/core/Context" },
  { name: "foam/core/Boot" },
  { name: "foam/core/FObject" },
  { name: "foam/core/Model" },
  { name: "foam/core/Property" },
  { name: "foam/core/Method" },
  { name: "foam/core/Boolean" },
  { name: "foam/core/AxiomArray" },
  { name: "foam/core/EndBoot" },
  { name: "foam/core/FObjectArray" },
  { name: "foam/core/Constant" },
  { name: "foam/core/Validation" },
  { name: "foam/pattern/Faceted" },
  { name: "foam/core/types" },
  { name: "foam/core/Topic" },
  { name: "foam/core/InnerClass" },
  { name: "foam/core/InnerEnum" },
  { name: "foam/core/Implements" },
  { name: "foam/core/ImportsExports" },
  { name: "foam/core/Listener" },
  { name: "foam/core/IDSupport" },
  { name: "foam/core/Requires" },
  { name: "foam/core/Slot" },
  { name: "foam/core/Proxy" },
  { name: "foam/core/Promised" },
  { name: "foam/core/Interface" },
  { name: "foam/core/ContextMethod" },
  { name: "foam/core/Window" },
  { name: "foam/core/ContextMultipleInheritence" },
  { name: "foam/classloader/ClassLoader" },
  { name: "foam/core/Argument" },
  { name: "foam/core/MultiMethod" },
  { name: "foam/core/debug", flags: ['debug'] },
  { name: "foam/pattern/Singleton" },
  { name: "foam/pattern/Multiton" },
  { name: "foam/core/Enum" },
  { name: "foam/core/JSON" },
  { name: "foam/core/XML"},
  { name: "foam/parse/parse" },
  { name: "foam/parse/json" },
  { name: "foam/parsers/FON" },
  { name: "foam/core/templates" },
  { name: "foam/i18n/Messages" },
  { name: "foam/core/Action" },
  { name: "foam/core/Reaction" },
  { name: "foam/core/Serializable" },
  { name: "foam/java/Argument", flags: ['java'] },
  { name: "foam/java/Class", flags: ['java'] },
  { name: "foam/java/ClassInfo", flags: ['java'] },
  { name: "foam/java/Code", flags: ['java'] },
  { name: "foam/java/CodeProperty", flags: ['java'] },
  { name: "foam/java/Field", flags: ['java'] },
  { name: "foam/java/Interface", flags: ['java'] },
  { name: "foam/java/InterfaceMethod", flags: ['java'] },
  { name: "foam/java/Method", flags: ['java'] },
  { name: "foam/java/Enum", flags: ['java'] },
  { name: "foam/java/MultiPartGetter", flags: ['java'] },
  { name: "foam/java/MultiPartSetter", flags: ['java'] },
  { name: "foam/java/Outputter", flags: ['java'] },
  { name: "foam/java/PropertyInfo", flags: ['java'] },
  { name: "foam/java/PropertyRefinement", flags: ['java'] },
  { name: "foam/java/Skeleton", flags: ['java'] },
  { name: "foam/java/JavaImport", flags: ['java'] },
  { name: "foam/java/refinements", flags: ['java'] },
  { name: "foam/util/Timer" },
  { name: "foam/log/LogLevel" },
  { name: "foam/log/Logger" },
  { name: "foam/log/ConsoleLogger" },
  { name: "foam/memento/MementoMgr" },
  { name: "lib/input", flags: ['web'] },
  { name: "foam/u2/AttrSlot" },
  { name: "foam/u2/ViewSpec" },
  { name: "foam/u2/Element" },
//  { name: "foam/u2/AttrSlot", flags: ['web'] },
//  { name: "foam/u2/Element", flags: ['web'] },
  { name: "foam/u2/ProgressView", flags: ['web'] },
  { name: "foam/dao/Sink" },
  { name: "foam/dao/SinkJava", flags: ['java'] },
  { name: "foam/dao/DAO" },
  { name: "foam/dao/DAOJava", flags: ['java'] },
  { name: "foam/dao/daoUtils" },
  { name: "foam/dao/DAODecorator" },
  { name: "foam/dao/AbstractDAO" },
  { name: "foam/dao/DAOProperty" },
  { name: "foam/mlang/order/Comparator", flags: ['js'] },
  { name: "foam/mlang/order/ComparatorJava", flags: ['java'] },
  { name: "foam/mlang/mlang" },
  { name: "foam/mlang/mlangJava", flags: ['java'] },
  { name: "foam/mlang/LabeledValue" },
  { name: "foam/dao/index/Plan" },
  { name: "foam/dao/index/Index" },
  { name: "foam/dao/index/ProxyIndex" },
  { name: "foam/dao/index/AltIndex" },
  { name: "foam/dao/index/ValueIndex" },
  { name: "foam/dao/index/AATree" },
  { name: "foam/dao/index/TreeIndex" },
  { name: "foam/dao/index/AutoIndex" },
  { name: "foam/dao/MDAO" },
  { name: "foam/dao/ArrayDAO" },
  { name: "foam/dao/TimestampDAO" },
  { name: "foam/dao/GUIDDAO" },
  { name: "foam/dao/ReadOnlyDAO" },
  { name: "foam/dao/JDAO" },
  { name: "foam/dao/Relationship" },
  { name: "foam/dao/RelationshipDAO" },
  { name: "foam/dao/ManyToManyRelationshipDAO" },
  { name: "foam/dao/LazyCacheDAO" },
  { name: "foam/dao/CachingDAO" },
  { name: "foam/dao/DeDupDAO" },
  { name: "foam/dao/LRUDAOManager" },
  { name: "foam/dao/SequenceNumberDAO" },
  { name: "foam/dao/ContextualizingDAO" },
  { name: "foam/dao/SyncDAO" },
  { name: "foam/dao/EasyDAO" },
  { name: "foam/dao/NoSelectAllDAO" },
  { name: "foam/dao/NullDAO" },
  { name: "foam/dao/TimingDAO" },
  { name: "foam/dao/LoggingDAO" },
  { name: "foam/dao/IDBDAO", flags: ['web'] },
  { name: "foam/dao/RestDAO" },
  { name: "foam/dao/EnabledAwareDAO" },
  { name: "foam/dao/LastModifiedAwareDAO" },
  { name: "foam/dao/ValidationDAODecorator" },
  { name: "foam/dao/SQL", flags: ['sql'] },
  { name: "foam/dao/NoDisjunctionDAO" },
  { name: "foam/parse/QueryParser" },
  { name: "foam/physics/Physical" },
  { name: "foam/physics/Collider" },
  { name: "foam/physics/PhysicsEngine" },
  { name: "foam/blob/Blob" },
  { name: "lib/node/json_dao", flags: ['node'] },
  { name: "lib/utf8" },
  { name: "lib/web/net" }, // No flags: ['web']: base classes for lib/node/net.
  { name: "lib/messageport", flags: ['web'] },
  { name: "lib/node/net", flags: ['node'] },
  { name: "lib/firebase" },
  { name: "lib/fcm" },
  { name: "lib/Stub" },
  { name: "lib/box" },
  { name: "lib/boxJava", flags: ['java'] },
  { name: "foam/box/Runnable" },
  { name: "foam/box/LogBox" },
  { name: "foam/box/BroadcastBox" },
  { name: "foam/box/pipeline/Pipeline" },
  { name: "foam/box/pipeline/PipelineBuilder" },
  { name: "foam/core/async" },
  { name: "foam/u2/ViewFactory", flags: ['web'] },
  { name: "foam/u2/daos", flags: ['web'] },
  { name: "foam/u2/TableView", flags: ['web'] },
  { name: "foam/u2/TableSelection", flags: ['web'] },
  { name: "foam/u2/Scroller", flags: ['web'] },
  { name: "foam/u2/ActionView", flags: ['web'] },
  { name: "foam/u2/DetailPropertyView", flags: ['web'] },
  { name: "foam/u2/DetailView", flags: ['web'] },
  { name: "foam/u2/tag/Image", flags: ['web'] },
  { name: "foam/u2/tag/Input", flags: ['web'] },
  { name: "foam/u2/tag/TextArea", flags: ['web'] },
  { name: "foam/u2/TextField", flags: ['web'] },
  { name: "foam/u2/IntView", flags: ['web'] },
  { name: "foam/u2/FloatView", flags: ['web'] },
  { name: "foam/u2/CheckBox", flags: ['web'] },
  { name: "foam/u2/CitationView", flags: ['web'] },
  { name: "foam/u2/PopupView", flags: ['web'] },
  { name: "foam/u2/DateView", flags: ['web'] },
  { name: "foam/u2/DateTimeView", flags: ['web'] },
  { name: "foam/u2/RangeView", flags: ['web'] },
  { name: "foam/u2/ReadWriteView", flags: ['web'] },
  { name: "foam/u2/HTMLElement", flags: ['web'] },
  { name: "foam/u2/tag/Select", flags: ['web'] },
  { name: "foam/u2/Tabs", flags: ['web'] },
  { name: "foam/u2/history/HistoryItemView", flags: ['web'] },
  { name: "foam/u2/history/HistoryView", flags: ['web'] },
  { name: "foam/u2/view/ChoiceView", flags: ['web'] },
  { name: "foam/u2/view/RadioView", flags: ['web'] },
  { name: "foam/u2/view/TextField", flags: ['web'] },
  { name: "foam/u2/view/TreeView", flags: ['web'] },
  { name: "foam/u2/view/DualView", flags: ['web'] },
  { name: "foam/u2/view/ColorPicker", flags: ['web'] },
  { name: "foam/u2/view/TableView", flags: ['web'] },
  { name: "foam/u2/view/EditColumnsView", flags: ['web'] },
  { name: "foam/u2/md/OverlayDropdown", flags: ['web'] },
  { name: "foam/u2/view/ScrollTableView", flags: ['web'] },
  { name: "foam/u2/view/BlobView", flags: ['web'] },
  { name: "foam/u2/view/StringArrayView", flags: ['web'] },
  { name: "foam/u2/view/ImageView", flags: ['web'] },
  { name: "foam/u2/EnumView", flags: ['web'] },
  { name: "foam/u2/ClassView", flags: ['web'] },
  { name: "foam/u2/view/ReferenceView", flags: ['web'] },
  { name: "foam/u2/tag/Card", flags: ['web'] },
  { name: "foam/u2/dialog/Popup", flags: ['web'] },
  { name: "foam/u2/Autocompleter", flags: ['web'] },
  { name: "foam/u2/search/FilterController", flags: ['web'] },
  { name: "foam/u2/search/GroupCompleter", flags: ['web'] },
  { name: "foam/u2/search/GroupAutocompleteSearchView", flags: ['web'] },
  { name: "foam/u2/search/GroupBySearchView", flags: ['web'] },
  { name: "foam/u2/search/SearchManager", flags: ['web'] },
  { name: "foam/u2/search/TextSearchView", flags: ['web'] },
  { name: "foam/u2/stack/Stack", flags: ['web'] },
  { name: "foam/u2/stack/StackView", flags: ['web'] },
  { name: "foam/u2/FoamTagLoader", flags: ['loader'] },
  { name: "foam/graphics/CView", flags: ['web'] },
  { name: "foam/graphics/ScrollCView", flags: ['web'] },
  { name: "foam/physics/PhysicalCircle", flags: ['web'] },
  { name: "foam/comics/DAOController" },
  { name: "foam/comics/DAOControllerView", flags: ['web'] },
  { name: "foam/comics/InlineDAOControllerView", flags: ['web'] },
  { name: "foam/comics/DAOCreateController" },
  { name: "foam/comics/DAOCreateControllerView", flags: ['web'] },
  { name: "foam/comics/DAOUpdateController" },
  { name: "foam/comics/DAOUpdateControllerView", flags: ['web'] },
  { name: "foam/comics/BrowserView", flags: ['web'] },
  { name: "foam/comics/InlineBrowserView", flags: ['web'] },
  { name: "foam/comics/RelationshipView", flags: ['web'] },
  { name: "foam/u2/view/RecipricalSearch", flags: ['web'] },
  { name: "lib/node/box", flags: ['node'] },
  { name: "foam/box/node/ForkBox", flags: ['node'] },
  { name: "foam/net/HTTPMethod" },
  { name: "lib/net" },
  { name: "foam/net/RetryHTTPRequest" },
  { name: "foam/net/auth/TokenBearerCredential" },
  { name: "foam/net/auth/AuthAwareHTTPRequest" },
  { name: "foam/net/auth/TokenBearerHTTPRequest" },
  { name: "foam/net/auth/AuthAgent" },
  { name: "foam/doc/DocBrowser", flags: ['debug'] },
  { name: "com/google/net/node/Google2LOAuthAgent", flags: ['node', 'gcloud'] },
  { name: "com/google/cloud/datastore/types", flags: ['gcloud'] },
  { name: "com/google/cloud/datastore/mlang", flags: ['gcloud'] },
  { name: "com/google/cloud/datastore/DatastoreDAO", flags: ['gcloud'] },
  { name: "com/google/cloud/datastore/BatchMutationDatastoreDAO", flags: ['gcloud'] },
  { name: "foam/net/node/Handler", flags: ['node'] },
  { name: "foam/net/node/FileHandler", flags: ['node'] },
  { name: "foam/net/node/StaticFileHandler", flags: ['node'] },
  { name: "foam/net/node/RestDAOHandler", flags: ['node'] },
  { name: "foam/net/node/Server", flags: ['node'] },
  { name: "foam/classloader/ClassLoader", flags: ['debug'] },
  { name: "foam/classloader/OrDAO", flags: ['debug'] },
  { name: "foam/classloader/WebModelFileDAO", flags: ['web', 'debug'] },
  { name: "foam/classloader/NodeModelFileDAO", flags: ['node', 'debug'] },
  { name: "foam/classloader/NodeJsModelExecutor", flags: ['node', 'debug'] },
  { name: "foam/parsers/html/lib" },
  { name: "foam/parsers/html/Attribute" },
  { name: "foam/parsers/html/TagType" },
  { name: "foam/parsers/html/Tag" },
  { name: "foam/parsers/html/HTMLLexer" },
  { name: "foam/core/ContextAware", flags: ['java'] },
  { name: "foam/dao/history/PropertyUpdate" },
  { name: "foam/dao/history/HistoryRecord" },
  { name: "foam/mop/MOP" },
  { name: "foam/mop/MOPJava", flags: ['java'] },
]);
