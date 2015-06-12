#import "RCTBridgeModule.h"

@interface ImagePickerManager : NSObject<RCTBridgeModule, UINavigationControllerDelegate, UIImagePickerControllerDelegate>

@property (strong, nonatomic) RCTResponseSenderBlock callback;

@end