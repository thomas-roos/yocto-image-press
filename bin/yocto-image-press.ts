#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { YoctoImagePressStack } from '../lib/yocto-image-press-stack';

const app = new cdk.App();
new YoctoImagePressStack(app, 'YoctoImagePressStack');
