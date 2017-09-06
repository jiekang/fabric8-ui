import {async, TestBed} from '@angular/core/testing';

const Pact = require('pact-web');
import {HttpModule} from '@angular/http';
import {LoggerFactory} from '../../app/space/wizard/common/logger';
import {AuthenticationService} from 'ngx-login-client';
import {ApiLocatorService} from '../../app/shared/api-locator.service';
import {Fabric8ForgeService} from '../../app/space/wizard/services/fabric8-forge.service';
import {step_1_1_output} from './import-wizard/step_1_1_output';
import {step_1_3_input} from './import-wizard/step_1_3_input';
import {step_1_3_output} from 'tests/forge-api/import-wizard/step_1_3_output';
import {step_1_2_input} from './import-wizard/step_1_2_input';
import {step_1_2_output} from './import-wizard/step_1_2_output';
import {step_2_1_output} from './import-wizard/step_2_1_output';
import {step_2_1_input} from './import-wizard/step_2_1_input';
import {step_2_2_output} from './import-wizard/step_2_2_output';
import {step_2_2_input} from './import-wizard/step_2_2_input';
import {step_3_1_input} from './import-wizard/step_3_1_input';
import {step_3_1_output} from 'tests/forge-api/import-wizard/step_3_1_output';
import {step_3_2_output} from './import-wizard/step_3_2_output';
import {step_3_2_input} from './import-wizard/step_3_2_input';
import {step_4_1_output} from './import-wizard/step_4_1_output';
import {step_4_1_input} from './import-wizard/step_4_1_input';
import {step_4_2_output} from './import-wizard/step_4_2_output';
import {step_4_2_input} from './import-wizard/step_4_2_input';

describe('Forge API tests:', () => {
  let mockLog: any;
  let fabric8ForgeService: Fabric8ForgeService;
  let mockAuthService: any;
  let mockApiLocatorService: any;
  let provider = Pact({consumer: 'AppGeneratorWizard', provider: 'ForgeGenerator', web: true});
  let stubForgeUrl = 'http://localhost:1234/forge/commands/';

  afterAll(done => {
    provider.finalize()
      .then(function () {
        done();
      }, function (err) {
        console.log('failed');
        done.fail(err);
      });
  });

  beforeEach(function () {
    mockLog = jasmine.createSpyObj('Logger', ['createLoggerDelegate']);
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken', 'isLoggedIn']);
    mockApiLocatorService = jasmine.createSpyObj('ApiLocatorService', ['forgeApiUrl']);
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        {
          provide: LoggerFactory, useValue: mockLog
        },
        {
          provide: AuthenticationService,
          useValue: mockAuthService
        },
        {
          provide: ApiLocatorService,
          useValue: mockApiLocatorService
        },
        Fabric8ForgeService
      ]
    });
    fabric8ForgeService = TestBed.get(Fabric8ForgeService);
    const log = () => {
    };
    mockLog.createLoggerDelegate.and.returnValue(log);
    mockAuthService.getToken.and.returnValue('SSO_TOKEN');
    mockAuthService.isLoggedIn.and.returnValue(true);
  });

  it('Step_1_1 - import wizard: init', done => {
    // given
    provider.addInteraction({
      state: 'step1.1.init',
      uponReceiving: 'step1.1',
      withRequest: {
        method: 'GET',
        path: '/forge/commands/fabric8-import-git'
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_1_1_output
      }
    }).then(() => {
        // when
        fabric8ForgeService.GetCommand(stubForgeUrl + 'fabric8-import-git').subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.metadata.name).toEqual('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(true);
          expect(response.state.canMoveToPreviousStep).toEqual(false);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          done();
        });
      },
      function (err) {
        console.log('failed');
        done.fail(err);
      });

  });

  it('Step_1_2 - import wizard: validate git organisation', done => {
    // given
    provider.addInteraction({
      state: 'step1.2.validate',
      uponReceiving: 'step1.2',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/validate',
        body: step_1_2_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_1_2_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/validate', step_1_2_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(true);
          expect(response.state.canMoveToPreviousStep).toEqual(false);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.messages.length).toEqual(0);
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });

  });

  it('Step_1_3 - import wizard: next git organisation', done => {
    // given
    provider.addInteraction({
      state: 'step1.3.next',
      uponReceiving: 'step1.3',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/next',
        body: step_1_3_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_1_3_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/next', step_1_3_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.metadata.name).toEqual('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.state.valid).toEqual(false); // bug in the forge api
          expect(response.state.canMoveToNextStep).toEqual(false);
          expect(response.state.canMoveToPreviousStep).toEqual(true);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.inputs[0].class).toEqual('UISelectMany');
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });
  });

  it('Step_2_1 - import wizard: validate git repositories', done => {
    // given
    provider.addInteraction({
      state: 'step2.1.validate',
      uponReceiving: 'step2.1',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/validate',
        body: step_2_1_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_2_1_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/validate', step_2_1_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(true);
          expect(response.state.canMoveToPreviousStep).toEqual(true);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.state.steps).toContain('Obsidian: Configure Pipeline');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep');
          expect(response.messages.length).toEqual(0);
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });

  });

  it('Step_2_2 - import wizard: next git repositories', done => {
    // given
    provider.addInteraction({
      state: 'step2.2.next',
      uponReceiving: 'step2.2',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/next',
        body: step_2_2_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_2_2_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/next', step_2_2_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.metadata.name).toEqual('Obsidian: Configure Pipeline');
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(true);
          expect(response.state.canMoveToPreviousStep).toEqual(true);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.state.steps).toContain('Obsidian: Configure Pipeline');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep');
          expect(response.inputs[0].class).toEqual('UISelectOne');
          expect(response.inputs[0].inputType).toEqual('org.jboss.forge.inputType.DEFAULT');
          expect(response.inputs[0].valueType).toEqual('io.fabric8.forge.generator.pipeline.PipelineDTO');
          expect(response.inputs[0].enabled).toEqual(true);
          expect(response.inputs[0].required).toEqual(false);
          expect(response.inputs[0].name).toEqual('pipeline');
          expect(response.inputs[1].class).toEqual('UISelectOne');
          expect(response.inputs[1].inputType).toEqual('org.jboss.forge.inputType.DEFAULT');
          expect(response.inputs[1].valueType).toEqual('java.lang.String');
          expect(response.inputs[1].enabled).toEqual(true);
          expect(response.inputs[1].required).toEqual(true);
          expect(response.inputs[1].name).toEqual('kubernetesSpace');
          expect(response.inputs[2].class).toEqual('UIInput');
          expect(response.inputs[2].inputType).toEqual('org.jboss.forge.inputType.DEFAULT');
          expect(response.inputs[2].valueType).toEqual('java.lang.String');
          expect(response.inputs[2].enabled).toEqual(true);
          expect(response.inputs[2].required).toEqual(false);
          expect(response.inputs[2].name).toEqual('labelSpace');
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });

  });

  it('Step_3_1 - import wizard: validate select pipeline process', done => {
    // given
    provider.addInteraction({
      state: 'step3.1.validate',
      uponReceiving: 'step3.1',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/validate',
        body: step_3_1_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_3_1_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/validate', step_3_1_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(true);
          expect(response.state.canMoveToPreviousStep).toEqual(true);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.state.steps).toContain('Obsidian: Configure Pipeline');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep');
          expect(response.messages.length).toEqual(0);
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });
  });

  it('Step_3_2 - import wizard: next select pipeline process', done => {
    // given
    provider.addInteraction({
      state: 'step3.2.next',
      uponReceiving: 'step3.2',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/next',
        body: step_3_2_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_3_2_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/next', step_3_2_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(false);
          expect(response.state.canMoveToPreviousStep).toEqual(true);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.state.steps).toContain('Obsidian: Configure Pipeline');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep');
          expect(response.messages).toBeUndefined();
          expect(response.inputs[0].class).toEqual('UISelectOne');
          expect(response.inputs[0].inputType).toEqual('org.jboss.forge.inputType.DEFAULT');
          expect(response.inputs[0].valueType).toEqual('java.lang.String');
          expect(response.inputs[0].enabled).toEqual(true);
          expect(response.inputs[0].required).toEqual(true);
          expect(response.inputs[0].name).toEqual('jenkinsSpace');
          expect(response.inputs[1].class).toEqual('UIInput');
          expect(response.inputs[1].inputType).toEqual('org.jboss.forge.inputType.DEFAULT');
          expect(response.inputs[1].valueType).toEqual('java.lang.Boolean');
          expect(response.inputs[1].enabled).toEqual(true);
          expect(response.inputs[1].required).toEqual(false);
          expect(response.inputs[1].name).toEqual('triggerBuild');
          expect(response.inputs[1].value).toEqual(true);
          expect(response.inputs[2].class).toEqual('UIInput');
          expect(response.inputs[2].inputType).toEqual('org.jboss.forge.inputType.DEFAULT');
          expect(response.inputs[2].valueType).toEqual('java.lang.Boolean');
          expect(response.inputs[2].enabled).toEqual(true);
          expect(response.inputs[2].required).toEqual(false);
          expect(response.inputs[2].name).toEqual('addCIWebHooks');
          expect(response.inputs[2].value).toEqual(true);
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });
  });

  it('Step_4_1 - import wizard: validate select jenkins and github hook', done => {
    // given
    provider.addInteraction({
      state: 'step4.1.validate',
      uponReceiving: 'step4.1',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/validate',
        body: step_4_1_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_4_1_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/validate', step_4_1_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data;
          expect(response.state.valid).toEqual(true);
          expect(response.state.canMoveToNextStep).toEqual(false);
          expect(response.state.canMoveToPreviousStep).toEqual(true);
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickOrganisationStep');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.github.GithubImportPickRepositoriesStep');
          expect(response.state.steps).toContain('Obsidian: Configure Pipeline');
          expect(response.state.steps).toContain('io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep');
          expect(response.messages.length).toEqual(0);
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });
  });

  it('Step_4_2 - import wizard: next select jenkins and github hook', done => {
    // given
    provider.addInteraction({
      state: 'step4.2.next',
      uponReceiving: 'step4.2',
      withRequest: {
        method: 'POST',
        path: '/forge/commands/fabric8-import-git/next',
        body: step_4_2_input
      },
      willRespondWith: {
        status: 200,
        headers: {'Content-Type': 'application/json'},
        body: step_4_2_output
      }
    }).then(() => {
      // when
      fabric8ForgeService.PostCommand(stubForgeUrl + 'fabric8-import-git/next', step_4_2_input)
        .subscribe((data: any) => {
          // then
          const response = data.payload.data.results;
          expect(response[4]).toEqual({warnings: []});
          expect(response[6].namespace).toEqual('ckrych');
          expect(response[6].gitRepositories.length).toEqual(2);
          expect(response[6].gitRepositories[0].url).toEqual('https://github.com/corinnekrych/sprint135.git');
          expect(response[6].gitRepositories[0].repoName).toEqual('sprint135');
          expect(response[6].gitRepositories[1].url).toEqual('https://github.com/corinnekrych/sprint135bis.git');
          expect(response[6].gitRepositories[1].repoName).toEqual('sprint135bis');
          expect(response[6].cheStackId).toEqual('vert.x');
          done();
        });
    }, function (err) {
      console.log('failed');
      done.fail(err);
    });
  });
});
