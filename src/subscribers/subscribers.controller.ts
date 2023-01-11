import { Body, ClassSerializerInterceptor, Inject, Post } from '@nestjs/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import CreateSubscriberDto from './dto/createSubscriber.dto';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
  ) {}
  @Post()
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.send(
      {
        cmd: 'add-subscriber',
      },
      subscriber,
    );
  }

  @MessagePattern({ cmd: 'add-subscriber' })
  async addSubscriber(
    @Payload() subscriber: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    // const newSubscriber = await this.subscribersService.addSubscriber(
    //   subscriber,
    // );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    console.log(originalMsg);
    console.log(channel.ack(originalMsg));
    return subscriber;
  }
}
