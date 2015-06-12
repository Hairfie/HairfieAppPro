@import UIKit;

#import "ImagePickerManager.h"

@implementation ImagePickerManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(presentImagePicker:(RCTResponseSenderBlock)callback) {
  self.callback = callback;
  
  UIImagePickerController *picker = [[UIImagePickerController alloc] init];
  picker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
  picker.delegate = self;
  
  [[ImagePickerManager getTopController] presentViewController:picker animated:YES completion:nil];
}

-(void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
  [self dismissImagePicker:picker];
  
  NSString *uri = [[info valueForKey:UIImagePickerControllerReferenceURL] absoluteString];
  UIImage *image = [info valueForKey:UIImagePickerControllerOriginalImage];
  
  self.callback(@[@{
      @"uri": uri,
      @"height": @(image.size.height),
      @"width": @(image.size.width),
      @"isStored": @YES
  }]);
}

-(void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
  [self dismissImagePicker:picker];
  self.callback(@[[NSNull null]]);
}

-(void)dismissImagePicker:(UIImagePickerController *)picker {
  [picker dismissViewControllerAnimated:YES completion:nil];
}

+(UIViewController*)getTopController {
  UIViewController *topViewController = [UIApplication sharedApplication].keyWindow.rootViewController;
  
  while (topViewController.presentedViewController) {
    topViewController = topViewController.presentedViewController;
  }
  
  return topViewController;
}

@end
