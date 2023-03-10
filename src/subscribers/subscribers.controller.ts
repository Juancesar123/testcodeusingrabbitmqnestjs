import { Body, ClassSerializerInterceptor, Inject, Post } from '@nestjs/common';
import { Controller, UseInterceptors } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MailService } from 'src/mail/mail.service';
import CreateSubscriberDto from './dto/createSubscriber.dto';

@Controller('subscribers')
@UseInterceptors(ClassSerializerInterceptor)
export class SubscribersController {
  constructor(
    @Inject('SUBSCRIBERS_SERVICE') private subscribersService: ClientProxy,
    private mailService: MailService,
  ) {}
  @Post()
  async createPost(@Body() subscriber: CreateSubscriberDto) {
    return this.subscribersService.emit('add-subscriber', subscriber);
  }

  @EventPattern('add-subscriber')
  async addSubscriber(
    @Payload() subscriber: CreateSubscriberDto,
    @Ctx() context: RmqContext,
  ) {
    // this.subscribersService.emit('add-subscriber', subscriber);
    const sendMail = await this.mailService.sendUserConfirmation('123');
    console.log(sendMail);
    // const newSubscriber = await this.subscribersService.addSubscriber(
    //   subscriber,
    // );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
    return subscriber;
  }
}
