import { Head2HeadRecord } from '@ffstats/models';
import { Service } from 'typedi';
import { DbRepository } from './dbRepository';

@Service()
export class Head2HeadRecordRepository extends DbRepository<Head2HeadRecord> {
  constructor() {
    super('head2head_records');
  }
}
