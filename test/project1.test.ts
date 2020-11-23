import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

import { HitCounter } from '../lib/hitcounter';

test('DynamoDB Table Created with Encryption', () => {
    const stack = new cdk.Stack();

    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });

    expectCDK(stack).to(haveResource('AWS::DynamoDB::Table', {
        SSESpecification: {
            SSEEnabled: true
        }
    }));
});

test('Lambda has correct variables', () => {
    const stack = new cdk.Stack();

    new HitCounter(stack, 'MyTestConstruct', {
        downstream: new lambda.Function(stack, 'TestFunction', {
            runtime: lambda.Runtime.NODEJS_10_X,
            handler: 'lambda.handler',
            code: lambda.Code.fromInline('test')
        })
    });

    expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
        Environment: {
            Variables: {
                DOWNSTREAM_FUNCTION_NAME: {
                    "Ref": "TestFunction22AD90FC"
                },
                HITS_TABLE_NAME: {
                    "Ref": "MyTestConstructHits24A357F0"
                }
            }
        }
    }));
});