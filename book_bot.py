import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Updater, CommandHandler, CallbackQueryHandler, CallbackContext, MessageHandler, Filters

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

# Inventory dictionary to hold book names and their quantities
inventory = {}

def start(update: Update, context: CallbackContext) -> None:
    """Send a message when the command /start is issued."""
    keyboard = [
        [InlineKeyboardButton("Add Book", callback_data='add_book')],
        [InlineKeyboardButton("Sell Book", callback_data='sell_book')],
        [InlineKeyboardButton("List Inventory", callback_data='list_inventory')]
    ]

    reply_markup = InlineKeyboardMarkup(keyboard)
    update.message.reply_text('Hi! Use the buttons below to manage your inventory:', reply_markup=reply_markup)

def button(update: Update, context: CallbackContext) -> None:
    """Handle button presses."""
    query = update.callback_query
    query.answer()
    
    if query.data == 'add_book':
        query.edit_message_text(text="Send the book details in the format: <book_name> <quantity>")
        context.user_data['action'] = 'add'
    elif query.data == 'sell_book':
        query.edit_message_text(text="Send the book details in the format: <book_name> <quantity>")
        context.user_data['action'] = 'sell'
    elif query.data == 'list_inventory':
        list_inventory(update, context)

def handle_message(update: Update, context: CallbackContext) -> None:
    """Handle messages for adding or selling books."""
    action = context.user_data.get('action')
    if not action:
        return

    try:
        book_name = ' '.join(update.message.text.split()[:-1])
        quantity = int(update.message.text.split()[-1])
        if action == 'add':
            if book_name in inventory:
                inventory[book_name] += quantity
            else:
                inventory[book_name] = quantity
            update.message.reply_text(f'Added {quantity} copies of "{book_name}" to the inventory.')
        elif action == 'sell':
            if book_name in inventory and inventory[book_name] >= quantity:
                inventory[book_name] -= quantity
                if inventory[book_name] == 0:
                    del inventory[book_name]
                update.message.reply_text(f'Sold {quantity} copies of "{book_name}".')
            else:
                update.message.reply_text(f'Not enough copies of "{book_name}" in inventory.')
        del context.user_data['action']
    except (IndexError, ValueError):
        update.message.reply_text('Incorrect format. Please use the format: <book_name> <quantity>')

def list_inventory(update: Update, context: CallbackContext) -> None:
    """List all books in the inventory."""
    if not inventory:
        update.callback_query.message.reply_text('Inventory is empty.')
    else:
        inventory_list = '\n'.join([f'{book}: {quantity}' for book, quantity in inventory.items()])
        update.callback_query.message.reply_text(f'Inventory:\n{inventory_list}')

def main() -> None:
    """Start the bot."""
    # Replace 'YOUR_TOKEN' with your actual bot token
    updater = Updater("7303441120:AAHS5XndvLOuiTw8eW_M7U3WjxyMnix6Bq4")

    dispatcher = updater.dispatcher

    dispatcher.add_handler(CommandHandler("start", start))
    dispatcher.add_handler(CallbackQueryHandler(button))
    dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, handle_message))

    updater.start_polling()
    updater.idle()

if __name__ == '__main__':
    main()
