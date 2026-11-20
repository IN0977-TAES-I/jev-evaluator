
Elapsed: 238 ms
Scenario: 009S_jsoup_org.jsoup.helper.HttpConnection_execute(Connection.Request,_Response)
{
  model: 'jev-1.14.0',
  answers: {
    conflict: {
      type: 'choice',
      choice: 'interfere',
      confidence: 0.02,
      probabilities: { interfere: 0.51, not_interfere: 0.49 }
    },
    inferfere: {
      type: 'choice',
      choice: 'diferent_lateral_triangle',
      confidence: 0.33,
      probabilities: {
        diferent_superior_triangle: 0.41,
        diferent_lateral_triangle: 0.55,
        equal_superior_triangle: 0.04
      }
    },
    compile: {
      type: 'score',
      score: 1.7,
      confidence: 0.55,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.11, '1': 0.08, '2': 0.81 }
    },
    runtime: {
      type: 'score',
      score: 0.76,
      confidence: 0,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.5, '1': 0.24, '2': 0.26 }
    }
  },
  usage: { input_tokens: 4518, output_tokens: 125 }
}
Elapsed: 255 ms
Scenario: 010S_resty-gwt_org.fusesource.restygwt.rebind.DirectRestServiceInterfaceClassCreator_getMethodCallback(JMethod)
{
  model: 'jev-1.14.0',
  answers: {
    conflict: {
      type: 'choice',
      choice: 'interfere',
      confidence: 0.2,
      probabilities: { interfere: 0.6, not_interfere: 0.4 }
    },
    inferfere: {
      type: 'choice',
      choice: 'diferent_lateral_triangle',
      confidence: 0.25,
      probabilities: {
        diferent_superior_triangle: 0.48,
        diferent_lateral_triangle: 0.5,
        equal_superior_triangle: 0.02
      }
    },
    compile: {
      type: 'score',
      score: 1.36,
      confidence: 0.04,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.25, '1': 0.14, '2': 0.61 }
    },
    runtime: {
      type: 'score',
      score: 0.65,
      confidence: 0.01,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.57, '1': 0.2, '2': 0.23 }
    }
  },
  usage: { input_tokens: 1630, output_tokens: 125 }
}
Elapsed: 278 ms
Scenario: 011S_swagger-maven-plugin_com.github.kongchen.swagger.docgen.reader.AbstractReader_hasValidAnnotations(List_Annotation_)
{
  model: 'jev-1.14.0',
  answers: {
    conflict: {
      type: 'choice',
      choice: 'interfere',
      confidence: 0.62,
      probabilities: { interfere: 0.81, not_interfere: 0.19 }
    },
    inferfere: {
      type: 'choice',
      choice: 'diferent_lateral_triangle',
      confidence: 0.38,
      probabilities: {
        diferent_superior_triangle: 0.39,
        diferent_lateral_triangle: 0.59,
        equal_superior_triangle: 0.02
      }
    },
    compile: {
      type: 'score',
      score: 1.81,
      confidence: 0.7,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.07, '1': 0.06, '2': 0.87 }
    },
    runtime: {
      type: 'score',
      score: 0.97,
      confidence: 0,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.41, '1': 0.2, '2': 0.39 }
    }
  },
  usage: { input_tokens: 2176, output_tokens: 125 }
}
Elapsed: 247 ms
Scenario: 012S_crawler4j_edu.uci.ics.crawler4j.parser.Parser_parse(Page,String)
{
  model: 'jev-1.14.0',
  answers: {
    conflict: {
      type: 'choice',
      choice: 'interfere',
      confidence: 0.16,
      probabilities: { interfere: 0.58, not_interfere: 0.42 }
    },
    inferfere: {
      type: 'choice',
      choice: 'diferent_lateral_triangle',
      confidence: 0.24,
      probabilities: {
        diferent_superior_triangle: 0.45,
        diferent_lateral_triangle: 0.49,
        equal_superior_triangle: 0.06
      }
    },
    compile: {
      type: 'score',
      score: 1.37,
      confidence: 0.05,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.26, '1': 0.11, '2': 0.63 }
    },
    runtime: {
      type: 'score',
      score: 0.71,
      confidence: 0,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.53, '1': 0.23, '2': 0.24 }
    }
  },
  usage: { input_tokens: 3508, output_tokens: 125 }
}
Elapsed: 276 ms
Scenario: 013S_moshi_com.squareup.moshi.ClassJsonAdapter_FACTORY
{
  model: 'jev-1.14.0',
  answers: {
    conflict: {
      type: 'choice',
      choice: 'interfere',
      confidence: 0.22,
      probabilities: { interfere: 0.61, not_interfere: 0.39 }
    },
    inferfere: {
      type: 'choice',
      choice: 'diferent_superior_triangle',
      confidence: 0.35,
      probabilities: {
        diferent_superior_triangle: 0.57,
        diferent_lateral_triangle: 0.39,
        equal_superior_triangle: 0.04
      }
    },
    compile: {
      type: 'score',
      score: 1.82,
      confidence: 0.73,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.06, '1': 0.06, '2': 0.88 }
    },
    runtime: {
      type: 'score',
      score: 0.99,
      confidence: 0,
      legend: { '0': 'Low', '1': 'Medium', '2': 'High' },
      probabilities: { '0': 0.39, '1': 0.24, '2': 0.37 }
    }
  },
  usage: { input_tokens: 4578, output_tokens: 126 }
}
Elapsed: 260 ms
apg-01@apg01-HP-Compaq-6005-Pro-SFF-PC:~/organization/IN0977-TAES-I/jev-demo$ npm run scenario code/mergedataset/gemini_no-interference_reduced_mergedataset.ts > 22-47_16-11-2026_GEMINI_EXP007-R
002_interference_reduced_mergedataset.json
apg-01@apg01-HP-Compaq-6005-Pro-SFF-PC:~/organization/IN0977-TAES-I/jev-demo$ npm run scenario code/mergedataset/gemini_no-interference_reduced_mergedataset.ts > 22-47_16-11-2026_GEMINI_EXP007-R002_no-interference_reduced_mergedataset.json
apg-01@apg01-HP-Compaq-6005-Pro-SFF-PC:~/organization/IN0977-TAES-I/jev-demo$ npm run scenario code/mergedataset/gemini_no-interference_reduced_mergedataset.ts ^C
apg-01@apg01-HP-Compaq-6005-Pro-SFF-PC:~/organization/IN0977-TAES-I/jev-demo$ npm run scenario code/mergedataset/interference-detection.ts

> jev-demo@1.0.0 scenario
> tsx --env-file=.env code/mergedataset/interference-detection.ts

Cenários: 115 (anotações source/sink: ligadas)
  640ms  interference/002S_fitnesse_fitnesse.testsystems.slim.tables.SlimTableFactory_SlimTableFactory()
  642ms  interference/003S_retrofit_retrofit.RequestBuilder_build()
  745ms  interference/001S_cloud-slang_io.cloudslang.lang.api.SlangImpl_getAllEventTypes()
  254ms  interference/005S_jsoup_org.jsoup.nodes.TextNode_outerHtmlHead(StringBuilder,_int,_Document.OutputSettings)
  320ms  interference/004S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.MongoDBRiverDefinition_parseSettings(String,_String,_RiverSettings,_ScriptService)
  273ms  interference/006S_netty_org.jboss.netty.handler.codec.frame.LengthFieldBasedFrameDecoder_decode(ChannelHandlerContext,_Channel,_ChannelBuffer)
  298ms  interference/007S_OpenTripPlanner_org.opentripplanner.routing.spt.MultiShortestPathTree_dominates(State,_State)
  260ms  interference/009S_jsoup_org.jsoup.helper.HttpConnection_execute(Connection.Request,_Response)
  341ms  interference/008S_jsoup_org.jsoup.helper.HttpConnection_execute(Connection.Request,_Response)
  248ms  interference/010S_resty-gwt_org.fusesource.restygwt.rebind.DirectRestServiceInterfaceClassCreator_getMethodCallback(JMethod)
  249ms  interference/011S_swagger-maven-plugin_com.github.kongchen.swagger.docgen.reader.AbstractReader_hasValidAnnotations(List_Annotation_)
  323ms  interference/012S_crawler4j_edu.uci.ics.crawler4j.parser.Parser_parse(Page,String)
  240ms  interference/013S_moshi_com.squareup.moshi.ClassJsonAdapter_FACTORY
  292ms  no-interference/001S_elasticsearch_org.elasticsearch.index.query.SimpleIndexQueryParserTests_setup()
  254ms  no-interference/002S_elasticsearch_org.elasticsearch.index.query.MultiMatchQueryBuilder_doXContent(XContentBuilder,_Params)
  237ms  no-interference/002S_elasticsearch_org.elasticsearch.index.query.support.NestedInnerQueryParseSupport_setPathLevel()
  254ms  no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.commongrams.CommonGramsTokenFilterFactoryTests_testCommonGramsAnalysis()
  242ms  no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.commongrams.CommonGramsTokenFilterFactoryTests_testQueryModeCommonGramsAnalysis()
  290ms  no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.KuromojiAnalysisTests_createAnalysisService()
  246ms  no-interference/004S_okhttp_com.squareup.okhttp.OkHttpClient_copyWithDefaults()
  305ms  no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.synonyms.SynonymsAnalysisTest_testSynonymsAnalysis()
  252ms  no-interference/007S_webbit_org.webbitserver.netty.WebSocketClient_adjustPipelineToWebSocket(ChannelHandlerContext,_MessageEvent,_ChannelHandler,_ChannelHandler)
  331ms  no-interference/005S_SimianArmy_com.netflix.simianarmy.basic.janitor.BasicJanitorMonkeyContext_getInstanceJanitor()
  342ms  no-interference/006S_druid_com.metamx.druid.loading.S3SegmentPusher_push(File,_DataSegment)
  293ms  no-interference/011S_spring-boot_org.springframework.boot.context.embedded.undertow.UndertowEmbeddedServletContainerFactory_createDeploymentManager(Servlet
  269ms  no-interference/014S_jsoup_org.jsoup.helper.HttpConnection_createConnection(Connection.Request)
  317ms  no-interference/013S_titan_com.thinkaurelius.titan.graphdb.database.serialize.SerializerInitialization_initialize(Serializer)
  253ms  no-interference/015S_retrofit_retrofit.RestAdapter_logAndReplaceRequest(Request)
  249ms  no-interference/015S_retrofit_retrofit.RestAdapter_logAndReplaceResponse(String,_Response,_long)
  242ms  no-interference/016S_retrofit_retrofit.RestAdapter_logAndReplaceRequest(Request)
  264ms  no-interference/017S_okhttp_com.squareup.okhttp.internal.bytes.GzipSource_consumeHeader(Deadline)
  259ms  no-interference/018S_HikariCP_com.zaxxer.hikari.HikariConfig_validate()
  270ms  no-interference/018S_HikariCP_com.zaxxer.hikari.HikariPool_addConnection()
  254ms  no-interference/019S_quickml_quickdt.experiments.OutOfTimeCrossValidatorRunner_getRandomForestBuilder(int,_int)
  268ms  no-interference/020S_pushy_com.relayrides.pushy.apns.PushManager_handleConnectionClosure(ApnsConnection_T_)
  258ms  no-interference/020S_pushy_com.relayrides.pushy.apns.PushManager_handleConnectionFailure(ApnsConnection_T_,_Throwable)
  260ms  no-interference/021S_java-faker_com.github.javafaker.Faker_Faker(Locale,_Random)
  249ms  no-interference/023S_cucumber-jvm_cuke4duke.internal.java.JavaLanguage_load(String)
  284ms  no-interference/022S_swagger-core_io.swagger.jaxrs2.OperationParser_getSchemaFromAnnotation(io.swagger.oas.annotations.media.Schema)
  245ms  no-interference/024S_dropwizard_io.dropwizard.setup.Bootstrap_Bootstrap(Application_T_)
  249ms  no-interference/026S_hector_me.prettyprint.cassandra.connection.HConnectionManager_operateWithFailover(Operation_)
  276ms  no-interference/025S_hector_me.prettyprint.cassandra.connection.client.HSaslThriftClient_open()
  243ms  no-interference/027S_jenkins_jenkins.slaves.DefaultJnlpSlaveReceiver_handle(String,_JnlpSlaveHandshake)
  261ms  no-interference/028S_logback_ch.qos.logback.core.rolling.TimeBasedFileNamingAndTriggeringPolicyBase_start()
  254ms  no-interference/029S_orientdb_com.orientechnologies.orient.core.Orient_startup()
  304ms  no-interference/030S_RxJava_rx.internal.operators.OperatorMulticast_connect(Action1_superSubscription_)
  271ms  no-interference/032S_alluxio_tachyon.hadoop.HdfsFileInputStream_HdfsFileInputStream(TachyonFS,_int,_Path,_Configuration,_int)
  325ms  no-interference/031S_SimianArmy_com.netflix.simianarmy.basic.BasicSimianArmyContext_BasicSimianArmyContext(String)
  252ms  no-interference/033S_voldemort_voldemort.VoldemortClientShell_VoldemortClientShell(ClientConfig,_String,_BufferedReader,_PrintStream,_PrintStream)
  259ms  no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Indexer_applyAdvancedTransformation(QueueEntry,_String)
  302ms  no-interference/034S_voldemort_voldemort.server.VoldemortConfig_VoldemortConfig(Props)
  309ms  no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Indexer_processBlockingQueue(QueueEntry)
  274ms  no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Slurper_addToStream(Operation,_Timestamp_,_DBObject,_String)
  308ms  no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.MongoDBRiverDefinition_parseSettings(String,_String,_RiverSettings,_ScriptService)
  235ms  no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Slurper_run()
  246ms  no-interference/036S_elasticsearch_org.elasticsearch.common.settings.ClusterSettings_BUILT_IN_CLUSTER_SETTINGS
  263ms  no-interference/036S_elasticsearch_org.elasticsearch.test.ESSingleNodeTestCase_newNode()
  257ms  no-interference/037S_elasticsearch_org.elasticsearch.rest.action.cat.RestIndicesAction_getTableWithHeader(RestRequest)
  272ms  no-interference/037S_elasticsearch_org.elasticsearch.rest.action.cat.RestNodesAction_getTableWithHeader(RestRequest)
  265ms  no-interference/037S_elasticsearch_org.elasticsearch.rest.action.cat.RestShardsAction_getTableWithHeader(RestRequest)
  249ms  no-interference/038S_elasticsearch_org.elasticsearch.rest.action.cat.RestIndicesAction_getTableWithHeader(RestRequest)
  273ms  no-interference/039S_elasticsearch_org.elasticsearch.rest.action.cat.RestNodesAction_getTableWithHeader(RestRequest)
  290ms  no-interference/040S_libgdx_com.badlogic.gdx.backends.lwjgl3.Lwjgl3Application_newWindow(ApplicationListener,_Lwjgl3WindowConfiguration)_
  238ms  no-interference/040S_libgdx_com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration_copy(Lwjgl3ApplicationConfiguration)_
  258ms  no-interference/041S_libgdx_com.badlogic.gdx.backends.lwjgl3.Lwjgl3ApplicationConfiguration_copy(Lwjgl3ApplicationConfiguration)
  253ms  no-interference/042S_RxJava_rx.concurrency.TestScheduler_triggerActions(long)
  245ms  no-interference/043S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.MongoDBRiverDefinition_parseSettings(String,_String,_RiverSettings,_ScriptService)
  314ms  no-interference/044S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Indexer_processBlockingQueue(QueueEntry)
  250ms  no-interference/046S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Slurper_run()
  304ms  no-interference/045S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Indexer_applyAdvancedTransformation(QueueEntry,_String)
  302ms  no-interference/047S_elasticsearch-river-mongodb_org.elasticsearch.river.mongodb.Slurper_addToStream(Operation,_Timestamp_,_DBObject,_String)
  264ms  no-interference/048S_hector_me.prettyprint.cassandra.connection.client.HKerberosThriftClient_open()
  313ms  no-interference/048S_hector_me.prettyprint.cassandra.connection.client.HThriftClient_open()
  308ms  no-interference/049S_hector_me.prettyprint.cassandra.connection.client.HThriftClient_open()
  257ms  no-interference/050S_titan_com.thinkaurelius.titan.graphdb.transaction.StandardTitanTx_StandardTitanTx(StandardTitanGraph,_TransactionConfiguration,_BackendTransaction)
  254ms  no-interference/051S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.fragments.SimpleFragment_generateScatterData(int,_float,_int)
  295ms  no-interference/051S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.ScatterChartActivity_onCreate(Bundle)
  304ms  no-interference/051S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.ScatterChartActivity_onProgressChanged(SeekBar,_int,_boolean)
  240ms  no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.LineChartActivity1_onCreate(Bundle)
  244ms  no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.LineChartActivity2_onCreate(Bundle)
  290ms  no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.RadarChartActivitry_onCreate(Bundle)
  264ms  no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.StackedBarActivityNegative_onCreate(Bundle)
  254ms  no-interference/053S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.StackedBarActivityNegative_onCreate(Bundle)
  259ms  no-interference/054S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.RadarChartActivitry_onCreate(Bundle)
  262ms  no-interference/055S_MPAndroidChart_com.xxmassdeveloper.mpchartexample.LineChartActivity2_onCreate(Bundle)
  260ms  no-interference/056S_MPAndroidChart_com.github.mikephil.charting.renderer.PieChartRenderer_drawData(Canvas)
  242ms  no-interference/058S_elasticsearch_org.elasticsearch.action.delete.TransportDeleteAction_executeDeleteRequestOnPrimary(DeleteRequest,_IndexShard)
  258ms  no-interference/058S_elasticsearch_org.elasticsearch.action.DocWriteResponse_readFrom(StreamInput)
  250ms  no-interference/058S_elasticsearch_org.elasticsearch.action.DocWriteResponse_toXContent(XContentBuilder,_Params)
  258ms  no-interference/058S_elasticsearch_org.elasticsearch.action.DocWriteResponse_writeTo(StreamOutput)
  256ms  no-interference/058S_elasticsearch_org.elasticsearch.action.support.replication.ReplicationOperation_execute()
  320ms  no-interference/058S_elasticsearch_org.elasticsearch.action.index.TransportIndexAction_executeIndexRequestOnPrimary(IndexRequest,_IndexShard,_MappingUpdatedAction)
  269ms  no-interference/058S_elasticsearch_org.elasticsearch.action.support.replication.TransportReplicationAction_doRun()
  341ms  no-interference/058S_elasticsearch_org.elasticsearch.action.support.replication.ReplicationOperationTests_testReplication()
  299ms  no-interference/058S_elasticsearch_org.elasticsearch.action.update.TransportUpdateAction_shardOperation(UpdateRequest,_ActionListener_UpdateResponse_,_int)
  233ms  no-interference/058S_elasticsearch_org.elasticsearch.index.engine.InternalEngine_InternalEngine(EngineConfig)_left-right-lines
  305ms  no-interference/058S_elasticsearch_org.elasticsearch.cluster.metadata.MetaDataCreateIndexService_createIndex(CreateIndexClusterStateUpdateRequest
  287ms  no-interference/058S_elasticsearch_org.elasticsearch.common.settings.IndexScopedSettings_BUILT_IN_INDEX_SETTINGS
  225ms  no-interference/059S_elasticsearch_org.elasticsearch.action.DocWriteResponse_readFrom(StreamInput)
  313ms  no-interference/058S_elasticsearch_org.elasticsearch.index.IndexSettings_IndexSettings(IndexMetaData,_Settings,_Predicate_String_,_IndexScopedSettings)
  335ms  no-interference/058S_elasticsearch_org.elasticsearch.index.engine.InternalEngineTests_testRecoverFromForeignTranslog()
  242ms  no-interference/060S_elasticsearch_org.elasticsearch.action.DocWriteResponse_toXContent(XContentBuilder,_Params)
  231ms  no-interference/061S_fitnesse_fitnesse.testsystems.slim.tables.SlimTableFactory_SlimTableFactory()
  251ms  no-interference/061S_fitnesse_fitnesse.testsystems.slim.tables.SlimTableFactoryTest_setUp()
  241ms  no-interference/062S_cloud-slang_io.cloudslang.lang.api.SlangImpl_getAllEventTypes()
  248ms  no-interference/062S_cloud-slang_io.cloudslang.lang.api.SlangImplTest_ALL_EVENTS_SIZE
  268ms  no-interference/064S_spring-boot_org.springframework.boot.autoconfigure.logging.AutoConfigurationReportLoggingInitializer_logAutoConfigurationReport(boolean)
  260ms  no-interference/065S_spring-boot_org.springframework.boot.jta.atomikos.AtomikosProperties_asProperties()
  278ms  no-interference/065S_spring-boot_org.springframework.boot.jta.atomikos.AtomikosPropertiesTests_testDefaultProperties()
  314ms  no-interference/065S_spring-boot_org.springframework.boot.jta.atomikos.AtomikosPropertiesTests_testProperties()
  251ms  no-interference/066S_spring-boot_org.springframework.boot.context.embedded.tomcat.TomcatEmbeddedServletContainerFactory_customizeConnector(Connector)
  257ms  no-interference/067S_spring-boot_org.springframework.boot.autoconfigure.mongo.MongoProperties_builder(MongoClientOptions)
  259ms  no-interference/068S_spring-boot_org.springframework.boot.context.web.SpringBootServletInitializer_createRootApplicationContext(ServletContext)
  253ms  no-interference/069S_spring-boot_org.springframework.boot.context.web.SpringBootServletInitializer_createRootApplicationContext(ServletContext)
  269ms  no-interference/070S_spring-boot_org.springframework.boot.autoconfigure.cache.RedisCacheConfiguration_cacheManager(RedisTemplate_Object,Object_)

Por cenário:
┌─────────┬──────────────────────────────────────────────────────────────────────────┬─────────────────┬─────────────────┬────────┬──────────────────────┬─────┐
│ (index) │ cenário                                                                  │ real            │ previsto        │ risco  │ tipo                 │ ok  │
├─────────┼──────────────────────────────────────────────────────────────────────────┼─────────────────┼─────────────────┼────────┼──────────────────────┼─────┤
│ 0       │ 'interference/001S_cloud-slang_io.cloudslang.lang.api.SlangImpl_getAllE' │ 'interfere'     │ 'not_interfere' │ '0.28' │ 'none'               │ '✗' │
│ 1       │ 'interference/002S_fitnesse_fitnesse.testsystems.slim.tables.SlimTableF' │ 'interfere'     │ 'not_interfere' │ '0.19' │ 'none'               │ '✗' │
│ 2       │ 'interference/003S_retrofit_retrofit.RequestBuilder_build()'             │ 'interfere'     │ 'not_interfere' │ '0.20' │ 'none'               │ '✗' │
│ 3       │ 'interference/004S_elasticsearch-river-mongodb_org.elasticsearch.river.' │ 'interfere'     │ 'not_interfere' │ '0.16' │ 'none'               │ '✗' │
│ 4       │ 'interference/005S_jsoup_org.jsoup.nodes.TextNode_outerHtmlHead(StringB' │ 'interfere'     │ 'not_interfere' │ '0.20' │ 'none'               │ '✗' │
│ 5       │ 'interference/006S_netty_org.jboss.netty.handler.codec.frame.LengthFiel' │ 'interfere'     │ 'not_interfere' │ '0.14' │ 'none'               │ '✗' │
│ 6       │ 'interference/007S_OpenTripPlanner_org.opentripplanner.routing.spt.Mult' │ 'interfere'     │ 'not_interfere' │ '0.15' │ 'none'               │ '✗' │
│ 7       │ 'interference/008S_jsoup_org.jsoup.helper.HttpConnection_execute(Connec' │ 'interfere'     │ 'not_interfere' │ '0.17' │ 'none'               │ '✗' │
│ 8       │ 'interference/009S_jsoup_org.jsoup.helper.HttpConnection_execute(Connec' │ 'interfere'     │ 'not_interfere' │ '0.14' │ 'none'               │ '✗' │
│ 9       │ 'interference/010S_resty-gwt_org.fusesource.restygwt.rebind.DirectRestS' │ 'interfere'     │ 'not_interfere' │ '0.26' │ 'none'               │ '✗' │
│ 10      │ 'interference/011S_swagger-maven-plugin_com.github.kongchen.swagger.doc' │ 'interfere'     │ 'interfere'     │ '0.71' │ 'side_not_preserved' │ '✓' │
│ 11      │ 'interference/012S_crawler4j_edu.uci.ics.crawler4j.parser.Parser_parse(' │ 'interfere'     │ 'not_interfere' │ '0.22' │ 'none'               │ '✗' │
│ 12      │ 'interference/013S_moshi_com.squareup.moshi.ClassJsonAdapter_FACTORY'    │ 'interfere'     │ 'not_interfere' │ '0.28' │ 'none'               │ '✗' │
│ 13      │ 'no-interference/001S_elasticsearch_org.elasticsearch.index.query.Simpl' │ 'não interfere' │ 'not_interfere' │ '0.15' │ 'none'               │ '✓' │
│ 14      │ 'no-interference/002S_elasticsearch_org.elasticsearch.index.query.Multi' │ 'não interfere' │ 'not_interfere' │ '0.17' │ 'none'               │ '✓' │
│ 15      │ 'no-interference/002S_elasticsearch_org.elasticsearch.index.query.suppo' │ 'não interfere' │ 'not_interfere' │ '0.45' │ 'side_not_preserved' │ '✓' │
│ 16      │ 'no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.co' │ 'não interfere' │ 'not_interfere' │ '0.27' │ 'none'               │ '✓' │
│ 17      │ 'no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.co' │ 'não interfere' │ 'not_interfere' │ '0.26' │ 'none'               │ '✓' │
│ 18      │ 'no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.Ku' │ 'não interfere' │ 'not_interfere' │ '0.27' │ 'none'               │ '✓' │
│ 19      │ 'no-interference/003S_elasticsearch_org.elasticsearch.index.analysis.sy' │ 'não interfere' │ 'not_interfere' │ '0.27' │ 'none'               │ '✓' │
│ 20      │ 'no-interference/004S_okhttp_com.squareup.okhttp.OkHttpClient_copyWithD' │ 'não interfere' │ 'not_interfere' │ '0.15' │ 'none'               │ '✓' │
│ 21      │ 'no-interference/005S_SimianArmy_com.netflix.simianarmy.basic.janitor.B' │ 'não interfere' │ 'not_interfere' │ '0.24' │ 'none'               │ '✓' │
│ 22      │ 'no-interference/006S_druid_com.metamx.druid.loading.S3SegmentPusher_pu' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 23      │ 'no-interference/007S_webbit_org.webbitserver.netty.WebSocketClient_adj' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 24      │ 'no-interference/011S_spring-boot_org.springframework.boot.context.embe' │ 'não interfere' │ 'not_interfere' │ '0.21' │ 'none'               │ '✓' │
│ 25      │ 'no-interference/013S_titan_com.thinkaurelius.titan.graphdb.database.se' │ 'não interfere' │ 'not_interfere' │ '0.42' │ 'merge_introduces'   │ '✓' │
│ 26      │ 'no-interference/014S_jsoup_org.jsoup.helper.HttpConnection_createConne' │ 'não interfere' │ 'not_interfere' │ '0.18' │ 'none'               │ '✓' │
│ 27      │ 'no-interference/015S_retrofit_retrofit.RestAdapter_logAndReplaceReques' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 28      │ 'no-interference/015S_retrofit_retrofit.RestAdapter_logAndReplaceRespon' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 29      │ 'no-interference/016S_retrofit_retrofit.RestAdapter_logAndReplaceReques' │ 'não interfere' │ 'not_interfere' │ '0.17' │ 'none'               │ '✓' │
│ 30      │ 'no-interference/017S_okhttp_com.squareup.okhttp.internal.bytes.GzipSou' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 31      │ 'no-interference/018S_HikariCP_com.zaxxer.hikari.HikariConfig_validate(' │ 'não interfere' │ 'not_interfere' │ '0.22' │ 'none'               │ '✓' │
│ 32      │ 'no-interference/018S_HikariCP_com.zaxxer.hikari.HikariPool_addConnecti' │ 'não interfere' │ 'not_interfere' │ '0.24' │ 'none'               │ '✓' │
│ 33      │ 'no-interference/019S_quickml_quickdt.experiments.OutOfTimeCrossValidat' │ 'não interfere' │ 'not_interfere' │ '0.46' │ 'side_not_preserved' │ '✓' │
│ 34      │ 'no-interference/020S_pushy_com.relayrides.pushy.apns.PushManager_handl' │ 'não interfere' │ 'not_interfere' │ '0.23' │ 'none'               │ '✓' │
│ 35      │ 'no-interference/020S_pushy_com.relayrides.pushy.apns.PushManager_handl' │ 'não interfere' │ 'not_interfere' │ '0.24' │ 'none'               │ '✓' │
│ 36      │ 'no-interference/021S_java-faker_com.github.javafaker.Faker_Faker(Local' │ 'não interfere' │ 'not_interfere' │ '0.26' │ 'none'               │ '✓' │
│ 37      │ 'no-interference/022S_swagger-core_io.swagger.jaxrs2.OperationParser_ge' │ 'não interfere' │ 'not_interfere' │ '0.28' │ 'none'               │ '✓' │
│ 38      │ 'no-interference/023S_cucumber-jvm_cuke4duke.internal.java.JavaLanguage' │ 'não interfere' │ 'not_interfere' │ '0.23' │ 'none'               │ '✓' │
│ 39      │ 'no-interference/024S_dropwizard_io.dropwizard.setup.Bootstrap_Bootstra' │ 'não interfere' │ 'not_interfere' │ '0.23' │ 'none'               │ '✓' │
│ 40      │ 'no-interference/025S_hector_me.prettyprint.cassandra.connection.client' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 41      │ 'no-interference/026S_hector_me.prettyprint.cassandra.connection.HConne' │ 'não interfere' │ 'not_interfere' │ '0.18' │ 'none'               │ '✓' │
│ 42      │ 'no-interference/027S_jenkins_jenkins.slaves.DefaultJnlpSlaveReceiver_h' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 43      │ 'no-interference/028S_logback_ch.qos.logback.core.rolling.TimeBasedFile' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 44      │ 'no-interference/029S_orientdb_com.orientechnologies.orient.core.Orient' │ 'não interfere' │ 'not_interfere' │ '0.28' │ 'none'               │ '✓' │
│ 45      │ 'no-interference/030S_RxJava_rx.internal.operators.OperatorMulticast_co' │ 'não interfere' │ 'not_interfere' │ '0.23' │ 'none'               │ '✓' │
│ 46      │ 'no-interference/031S_SimianArmy_com.netflix.simianarmy.basic.BasicSimi' │ 'não interfere' │ 'not_interfere' │ '0.13' │ 'none'               │ '✓' │
│ 47      │ 'no-interference/032S_alluxio_tachyon.hadoop.HdfsFileInputStream_HdfsFi' │ 'não interfere' │ 'not_interfere' │ '0.09' │ 'none'               │ '✓' │
│ 48      │ 'no-interference/033S_voldemort_voldemort.VoldemortClientShell_Voldemor' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 49      │ 'no-interference/034S_voldemort_voldemort.server.VoldemortConfig_Voldem' │ 'não interfere' │ 'not_interfere' │ '0.11' │ 'none'               │ '✓' │
│ 50      │ 'no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.13' │ 'none'               │ '✓' │
│ 51      │ 'no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.18' │ 'none'               │ '✓' │
│ 52      │ 'no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.15' │ 'none'               │ '✓' │
│ 53      │ 'no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.26' │ 'none'               │ '✓' │
│ 54      │ 'no-interference/035S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.13' │ 'none'               │ '✓' │
│ 55      │ 'no-interference/036S_elasticsearch_org.elasticsearch.common.settings.C' │ 'não interfere' │ 'not_interfere' │ '0.38' │ 'none'               │ '✓' │
│ 56      │ 'no-interference/036S_elasticsearch_org.elasticsearch.test.ESSingleNode' │ 'não interfere' │ 'not_interfere' │ '0.11' │ 'none'               │ '✓' │
│ 57      │ 'no-interference/037S_elasticsearch_org.elasticsearch.rest.action.cat.R' │ 'não interfere' │ 'not_interfere' │ '0.14' │ 'none'               │ '✓' │
│ 58      │ 'no-interference/037S_elasticsearch_org.elasticsearch.rest.action.cat.R' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 59      │ 'no-interference/037S_elasticsearch_org.elasticsearch.rest.action.cat.R' │ 'não interfere' │ 'not_interfere' │ '0.13' │ 'none'               │ '✓' │
│ 60      │ 'no-interference/038S_elasticsearch_org.elasticsearch.rest.action.cat.R' │ 'não interfere' │ 'not_interfere' │ '0.13' │ 'none'               │ '✓' │
│ 61      │ 'no-interference/039S_elasticsearch_org.elasticsearch.rest.action.cat.R' │ 'não interfere' │ 'not_interfere' │ '0.15' │ 'none'               │ '✓' │
│ 62      │ 'no-interference/040S_libgdx_com.badlogic.gdx.backends.lwjgl3.Lwjgl3App' │ 'não interfere' │ 'not_interfere' │ '0.21' │ 'none'               │ '✓' │
│ 63      │ 'no-interference/040S_libgdx_com.badlogic.gdx.backends.lwjgl3.Lwjgl3App' │ 'não interfere' │ 'not_interfere' │ '0.12' │ 'none'               │ '✓' │
│ 64      │ 'no-interference/041S_libgdx_com.badlogic.gdx.backends.lwjgl3.Lwjgl3App' │ 'não interfere' │ 'not_interfere' │ '0.12' │ 'none'               │ '✓' │
│ 65      │ 'no-interference/042S_RxJava_rx.concurrency.TestScheduler_triggerAction' │ 'não interfere' │ 'not_interfere' │ '0.26' │ 'none'               │ '✓' │
│ 66      │ 'no-interference/043S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.14' │ 'none'               │ '✓' │
│ 67      │ 'no-interference/044S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.23' │ 'none'               │ '✓' │
│ 68      │ 'no-interference/045S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.10' │ 'none'               │ '✓' │
│ 69      │ 'no-interference/046S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.14' │ 'none'               │ '✓' │
│ 70      │ 'no-interference/047S_elasticsearch-river-mongodb_org.elasticsearch.riv' │ 'não interfere' │ 'not_interfere' │ '0.27' │ 'none'               │ '✓' │
│ 71      │ 'no-interference/048S_hector_me.prettyprint.cassandra.connection.client' │ 'não interfere' │ 'not_interfere' │ '0.22' │ 'none'               │ '✓' │
│ 72      │ 'no-interference/048S_hector_me.prettyprint.cassandra.connection.client' │ 'não interfere' │ 'not_interfere' │ '0.22' │ 'none'               │ '✓' │
│ 73      │ 'no-interference/049S_hector_me.prettyprint.cassandra.connection.client' │ 'não interfere' │ 'not_interfere' │ '0.21' │ 'none'               │ '✓' │
│ 74      │ 'no-interference/050S_titan_com.thinkaurelius.titan.graphdb.transaction' │ 'não interfere' │ 'not_interfere' │ '0.11' │ 'none'               │ '✓' │
│ 75      │ 'no-interference/051S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.14' │ 'none'               │ '✓' │
│ 76      │ 'no-interference/051S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 77      │ 'no-interference/051S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.32' │ 'none'               │ '✓' │
│ 78      │ 'no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.30' │ 'none'               │ '✓' │
│ 79      │ 'no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 80      │ 'no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.17' │ 'none'               │ '✓' │
│ 81      │ 'no-interference/052S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.22' │ 'none'               │ '✓' │
│ 82      │ 'no-interference/053S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.26' │ 'none'               │ '✓' │
│ 83      │ 'no-interference/054S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 84      │ 'no-interference/055S_MPAndroidChart_com.xxmassdeveloper.mpchartexample' │ 'não interfere' │ 'not_interfere' │ '0.25' │ 'none'               │ '✓' │
│ 85      │ 'no-interference/056S_MPAndroidChart_com.github.mikephil.charting.rende' │ 'não interfere' │ 'not_interfere' │ '0.43' │ 'none'               │ '✓' │
│ 86      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.delete.Tra' │ 'não interfere' │ 'not_interfere' │ '0.29' │ 'none'               │ '✓' │
│ 87      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.DocWriteRe' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 88      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.DocWriteRe' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 89      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.DocWriteRe' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 90      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.index.Tran' │ 'não interfere' │ 'not_interfere' │ '0.30' │ 'none'               │ '✓' │
│ 91      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.support.re' │ 'não interfere' │ 'not_interfere' │ '0.39' │ 'none'               │ '✓' │
│ 92      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.support.re' │ 'não interfere' │ 'not_interfere' │ '0.20' │ 'none'               │ '✓' │
│ 93      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.support.re' │ 'não interfere' │ 'review'        │ '0.57' │ 'none'               │ '?' │
│ 94      │ 'no-interference/058S_elasticsearch_org.elasticsearch.action.update.Tra' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 95      │ 'no-interference/058S_elasticsearch_org.elasticsearch.cluster.metadata.' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 96      │ 'no-interference/058S_elasticsearch_org.elasticsearch.common.settings.I' │ 'não interfere' │ 'not_interfere' │ '0.21' │ 'none'               │ '✓' │
│ 97      │ 'no-interference/058S_elasticsearch_org.elasticsearch.index.engine.Inte' │ 'não interfere' │ 'not_interfere' │ '0.14' │ 'none'               │ '✓' │
│ 98      │ 'no-interference/058S_elasticsearch_org.elasticsearch.index.engine.Inte' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 99      │ 'no-interference/058S_elasticsearch_org.elasticsearch.index.IndexSettin' │ 'não interfere' │ 'not_interfere' │ '0.12' │ 'none'               │ '✓' │
│ 100     │ 'no-interference/059S_elasticsearch_org.elasticsearch.action.DocWriteRe' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 101     │ 'no-interference/060S_elasticsearch_org.elasticsearch.action.DocWriteRe' │ 'não interfere' │ 'not_interfere' │ '0.22' │ 'none'               │ '✓' │
│ 102     │ 'no-interference/061S_fitnesse_fitnesse.testsystems.slim.tables.SlimTab' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 103     │ 'no-interference/061S_fitnesse_fitnesse.testsystems.slim.tables.SlimTab' │ 'não interfere' │ 'not_interfere' │ '0.18' │ 'none'               │ '✓' │
│ 104     │ 'no-interference/062S_cloud-slang_io.cloudslang.lang.api.SlangImpl_getA' │ 'não interfere' │ 'not_interfere' │ '0.25' │ 'none'               │ '✓' │
│ 105     │ 'no-interference/062S_cloud-slang_io.cloudslang.lang.api.SlangImplTest_' │ 'não interfere' │ 'interfere'     │ '0.64' │ 'all_differ'         │ '✗' │
│ 106     │ 'no-interference/064S_spring-boot_org.springframework.boot.autoconfigur' │ 'não interfere' │ 'not_interfere' │ '0.17' │ 'none'               │ '✓' │
│ 107     │ 'no-interference/065S_spring-boot_org.springframework.boot.jta.atomikos' │ 'não interfere' │ 'not_interfere' │ '0.24' │ 'none'               │ '✓' │
│ 108     │ 'no-interference/065S_spring-boot_org.springframework.boot.jta.atomikos' │ 'não interfere' │ 'interfere'     │ '0.68' │ 'side_not_preserved' │ '✗' │
│ 109     │ 'no-interference/065S_spring-boot_org.springframework.boot.jta.atomikos' │ 'não interfere' │ 'interfere'     │ '0.55' │ 'all_differ'         │ '✗' │
│ 110     │ 'no-interference/066S_spring-boot_org.springframework.boot.context.embe' │ 'não interfere' │ 'not_interfere' │ '0.33' │ 'none'               │ '✓' │
│ 111     │ 'no-interference/067S_spring-boot_org.springframework.boot.autoconfigur' │ 'não interfere' │ 'not_interfere' │ '0.16' │ 'none'               │ '✓' │
│ 112     │ 'no-interference/068S_spring-boot_org.springframework.boot.context.web.' │ 'não interfere' │ 'not_interfere' │ '0.13' │ 'none'               │ '✓' │
│ 113     │ 'no-interference/069S_spring-boot_org.springframework.boot.context.web.' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
│ 114     │ 'no-interference/070S_spring-boot_org.springframework.boot.autoconfigur' │ 'não interfere' │ 'not_interfere' │ '0.19' │ 'none'               │ '✓' │
└─────────┴──────────────────────────────────────────────────────────────────────────┴─────────────────┴─────────────────┴────────┴──────────────────────┴─────┘

Métricas (pesos 'balanced', limiar 0.5):
┌─────────┬─────┬─────────┬────────┬────┬────┬────┬────┬──────────┬───────────┬────────┬─────────┐
│ (index) │ n   │ decided │ review │ tp │ fp │ fn │ tn │ accuracy │ precision │ recall │ f1      │
├─────────┼─────┼─────────┼────────┼────┼────┼────┼────┼──────────┼───────────┼────────┼─────────┤
│ 0       │ 115 │ 114     │ 1      │ 1  │ 3  │ 12 │ 98 │ '86.8%'  │ '25.0%'   │ '7.7%' │ '11.8%' │
└─────────┴─────┴─────────┴────────┴────┴────┴────┴────┴──────────┴───────────┴────────┴─────────┘
Tokens de entrada (chamadas novas + cache): 530093 | latência média: 282 ms







