@import UIKit;
@import AssetsLibrary;
#import "HairfieImageManager.h"

@implementation HairfieImageManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(moveCapturedImage:(NSString *)uri withCallback:(RCTResponseSenderBlock)callback) {
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    UIImage *image = [[UIImage alloc] initWithContentsOfFile:uri];
    
    if (nil == image) {
      dispatch_async(dispatch_get_main_queue(), ^{
        callback(@[@{@"message": @"Failed to load image"}]);
      });
      return;
    }
    
    // scale captured image if
    if (image.size.width != 640 || image.size.height != 640) {
      image = [self scaleImage:image];
    }
    
    // save new temporary image
    [self saveTempImage:image
            withSuccess:^(NSString *newUri) {
              // remove original image
              NSError *error = nil;
              [[NSFileManager defaultManager] removeItemAtPath:uri error:&error];
              
              if (nil != error) {
                NSLog(@"failed to remove original image: %@", error.localizedDescription);
              }
              
              dispatch_async(dispatch_get_main_queue(), ^{
                callback(@[[NSNull null], @{
                             @"uri": newUri,
                             @"height": @(image.size.height),
                             @"width": @(image.size.width),
                             @"isStatic": @YES
                             }]);
              });
              
            }
             andFailure:^(NSError *error) {
               dispatch_async(dispatch_get_main_queue(), ^{
                 callback(@[@{@"message": error.localizedDescription}]);
               });
             }];
  });
  
}

RCT_EXPORT_METHOD(createScaledCopyOfImage:(NSString *)uri withCallback:(RCTResponseSenderBlock)callback) {
  
  if (![uri hasPrefix:@"assets-library"]) {
    callback(@[@{@"message": @"Works with assets library images only :("}]);
    return;
  }
  
  dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
    
    ALAssetsLibrary *library = [[ALAssetsLibrary alloc] init];
    
    [library assetForURL:[NSURL URLWithString:uri] resultBlock:^(ALAsset *asset) {
      if (asset) {
        @autoreleasepool {
          ALAssetRepresentation *representation = [asset defaultRepresentation];
          ALAssetOrientation orientation = [representation orientation];
          UIImage *image = [UIImage imageWithCGImage:[representation fullResolutionImage] scale:1.0f orientation:(UIImageOrientation)orientation];
          
          // scale it
          image = [self scaleImage:image];
          
          // save new temporary image
          [self saveTempImage:image
                  withSuccess:^(NSString *newUri) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                      callback(@[[NSNull null], @{
                                   @"uri": newUri,
                                   @"height": @(image.size.height),
                                   @"width": @(image.size.width),
                                   @"isStatic": @YES
                                   }]);
                    });
                  }
                   andFailure:^(NSError *error) {
                     dispatch_async(dispatch_get_main_queue(), ^{
                       callback(@[@{@"message": error.localizedDescription}]);
                     });
                   }];
        }
      } else {
        dispatch_async(dispatch_get_main_queue(), ^{
          callback(@[@{@"message": @"Failed to load asset"}]);
        });
      }
    } failureBlock:^(NSError *loadError) {
      dispatch_async(dispatch_get_main_queue(), ^{
        callback(@[@{@"message": @"Failed to load asset"}]);
      });
    }];
  });
}

-(UIImage *)scaleImage:(UIImage*)image {
  // crop image to make it square
  CGFloat imageWidth = CGImageGetWidth(image.CGImage);
  CGFloat imageHeight = CGImageGetHeight(image.CGImage);
  CGFloat size = MIN(imageWidth, imageHeight);
  CGFloat x = (imageWidth - size) / 2;
  CGFloat y = (imageHeight - size) / 2;
  CGRect cropRect = CGRectMake(x, y, size, size);
  CGImageRef imageRef = CGImageCreateWithImageInRect([image CGImage], cropRect);
  UIImage *croppedImage = [UIImage imageWithCGImage:imageRef scale:1.0 orientation:image.imageOrientation];
  CGImageRelease(imageRef);
  
  // scale it to 640x640
  UIGraphicsBeginImageContextWithOptions(CGSizeMake(640, 640), NO, 1.0);
  [croppedImage drawInRect:CGRectMake(0, 0, 640, 640)];
  UIImage *scaledImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  
  return scaledImage;
}

-(void)saveTempImage:(UIImage *)image
         withSuccess:(void (^) (NSString *uri))success
          andFailure:(void (^) (NSError *error))failure
{
  NSString *fileName = [NSString stringWithFormat:@"%@.jpg", [[NSProcessInfo processInfo] globallyUniqueString]];
  NSURL *fileURL = [NSURL fileURLWithPath:[NSTemporaryDirectory() stringByAppendingPathComponent:fileName]];
  NSData *imageData = UIImageJPEGRepresentation(image, 1.0);
  NSError *error = nil;
  
  [imageData writeToURL:fileURL options:NSDataWritingAtomic error:&error];
  
  if (nil == error) {
    success([fileURL absoluteString]);
  } else {
    failure(error);
  }
}

@end
